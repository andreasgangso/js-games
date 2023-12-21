/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerDefaultSpeed = 2;
const ballDefaultSpeed = canvas.width > 1000 ? 3 : 2;

let paused = false;

const playerBlue = {
    x: 10,
    y: canvas.height / 2,
    direction: 0,
    speed: playerDefaultSpeed,
    score: 0,
};

const playerGreen = {
    x: canvas.width - 20,
    y: canvas.height / 2,
    direction: 0,
    speed: playerDefaultSpeed,
    score: 0,
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: ballDefaultSpeed,
    directionX: Math.random() > 0.5 ? 1 : -1,
    directionY: Math.random() > 0.5 ? 1 : -1,
};

const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
};

function newRound() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = ballDefaultSpeed;
    playerBlue.speed = playerDefaultSpeed;
    playerGreen.speed = playerDefaultSpeed;
}

function gameOver() {
    paused = true;

    // Paint background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paint text
    ctx.font = '30px Arial';
    if (playerBlue.score > playerGreen.score) {
        ctx.fillStyle = 'cyan';
        ctx.fillText('Blue wins!', canvas.width / 2 - 100, canvas.height / 2);
    } else if (playerBlue.score < playerGreen.score) {
        ctx.fillStyle = 'lightgreen';
        ctx.fillText('Green wins!', canvas.width / 2 - 100, canvas.height / 2);
    } else {
        ctx.fillStyle = 'white';
        ctx.fillText('Tie!', canvas.width / 2 - 50, canvas.height / 2);
    }
    ctx.fillText(
        'Press space to play again',
        canvas.width / 2 - 200,
        canvas.height / 2 + 50
    );
}

function gameLoop() {
    // Handle player movement
    playerBlue.direction = keys.w ? -1 : keys.s ? 1 : 0;
    playerGreen.direction = keys.ArrowUp ? -1 : keys.ArrowDown ? 1 : 0;

    // Move players and ball
    playerBlue.y += playerBlue.direction * playerBlue.speed;
    playerGreen.y += playerGreen.direction * playerGreen.speed;
    ball.x += ball.directionX * ball.speed;
    ball.y += ball.directionY * ball.speed;

    // Ball collisions
    if (ball.y < 0 || ball.y > canvas.height - 10) ball.directionY *= -1;
    if (ball.x < 0) {
        playerGreen.score++;
        ball.directionX = 1;
        newRound();
    }
    if (ball.x > canvas.width - 10) {
        playerBlue.score++;
        if (playerBlue.score === 5) {
            gameOver();
            return;
        }
        ball.directionX = -1;
        newRound();
    }

    // Check if the ball is colliding with either player1 OR player2
    if (
        (ball.x < playerBlue.x &&
            ball.y > playerBlue.y &&
            ball.y < playerBlue.y + 100) ||
        (ball.x > playerGreen.x &&
            ball.y > playerGreen.y &&
            ball.y < playerGreen.y + 100)
    ) {
        ball.directionX *= -1;
        ball.speed += 0.5;
        playerBlue.speed += 0.5;
        playerGreen.speed += 0.5;
    }

    draw();
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '30px Arial';

    ctx.fillStyle = 'cyan';
    ctx.fillText(playerBlue.score, 100, 100);
    ctx.fillRect(playerBlue.x, playerBlue.y, 10, 100);

    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(playerGreen.x, playerGreen.y, 10, 100);
    ctx.fillText(playerGreen.score, canvas.width - 100, 100);

    ctx.fillStyle = 'white';
    ctx.fillRect(ball.x, ball.y, 10, 10);
}

window.addEventListener('keydown', (event) => {
    if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        keys[event.key] = true;
    }
    if (event.key === ' ') {
        if (paused) {
            paused = false;
            playerBlue.score = 0;
            playerGreen.score = 0;
            gameLoop();
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        keys[event.key] = false;
    }
});

gameLoop();
