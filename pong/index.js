/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerDefaultSpeed = 2;
const ballDefaultSpeed = canvas.width > 1000 ? 3 : 2;

let gameOver = false;

const input = {
    w: false,
    s: false,
    up: false,
    down: false,
};

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
    directionX: getRandomDirection(),
    directionY: getRandomDirection(),
};

// BONUS: Random direction for ball
function getRandomDirection() {
    let randomNumber = Math.random();
    if (randomNumber > 0.5) {
        return 1;
    } else {
        return -1;
    }
}

function newRound() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = ballDefaultSpeed;
    playerBlue.speed = playerDefaultSpeed;
    playerGreen.speed = playerDefaultSpeed;
}

function gameLoop() {
    // INPUT LOGIC for player green
    if (input.w) {
        playerBlue.direction = -1;
    } else if (input.s) {
        playerBlue.direction = 1;
    } else if (!input.w && !input.s) {
        playerBlue.direction = 0;
    }

    // INPUT LOGIC for player blue
    if (input.up) {
        playerGreen.direction = -1;
    } else if (input.down) {
        playerGreen.direction = 1;
    } else if (!input.up && !input.down) {
        playerGreen.direction = 0;
    }

    // PLAYER MOVEMENT LOGIC
    playerBlue.y += playerBlue.direction * playerBlue.speed;
    playerGreen.y += playerGreen.direction * playerGreen.speed;

    // BALL MOVEMENT LOGIC
    ball.x += ball.directionX * ball.speed;
    ball.y += ball.directionY * ball.speed;

    // BALL COLLIDING WITH WALL?
    if (ball.y < 0 || ball.y > canvas.height - 10) {
        ball.directionY = -ball.directionY;
    }

    // BALL COLLIDING WITH LEFT SIDE?
    if (ball.x < 0) {
        playerGreen.score++;
        if (playerGreen.score === 2) {
            showGameOver();
        } else {
            newRound();
        }
    }

    // BALL COLLIDING WITH RIGHT SIDE?
    if (ball.x > canvas.width - 10) {
        playerBlue.score++;
        if (playerBlue.score === 2) {
            showGameOver();
        } else {
            newRound();
        }
    }

    // BALL COLLIDING WITH PLAYER BLUE?
    if
        (ball.x < playerBlue.x &&
        ball.y > playerBlue.y &&
        ball.y < playerBlue.y + 100
    ) {
        whenBallHitsPlayer()
    }

    // BALL COLLIDING WITH PLAYER GREEN?
    if (ball.x > playerGreen.x &&
        ball.y > playerGreen.y &&
        ball.y < playerGreen.y + 100) {
        whenBallHitsPlayer()
    }

    if (!gameOver) {
        draw();
        window.requestAnimationFrame(gameLoop);
    }
}

function whenBallHitsPlayer() {
    ball.speed += 0.5;
    playerBlue.speed += 0.5;
    playerGreen.speed += 0.5;
    ball.directionX = -ball.directionX;
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
    if (event.key === 'w') {
        playerBlue.direction = -1;
    } else if (event.key === 's') {
        playerBlue.direction = 1;
    } else if (event.key === 'ArrowUp') {
        playerGreen.direction = -1;
    } else if (event.key === 'ArrowDown') {
        playerGreen.direction = 1;
    }

    if (event.key === ' ') {
        if (gameOver) {
            gameOver = false;
            playerBlue.score = 0;
            playerGreen.score = 0;
            newRound();
            gameLoop();
        }
    }
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        input.w = true;
    } else if (event.key === 's') {
        input.s = true;
    } else if (event.key === 'ArrowUp') {
        input.up = true;
    } else if (event.key === 'ArrowDown') {
        input.down = true;
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        input.w = false;
    } else if (event.key === 's') {
        input.s = false;
    } else if (event.key === 'ArrowUp') {
        input.up = false;
    } else if (event.key === 'ArrowDown') {
        input.down = false;
    }
});


gameLoop();


// BONUS: Game over screen
function showGameOver() {
    gameOver = true;

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