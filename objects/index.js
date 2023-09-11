/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerDefaultSpeed = 2;
const ballDefaultSpeed = canvas.width > 1000 ? 3 : 2

const player1 = {
    x: 10,
    y: canvas.height / 2,
    direction: 0,
    speed: playerDefaultSpeed,
    score: 0
};

const player2 = {
    x: canvas.width - 20,
    y: canvas.height / 2,
    direction: 0,
    speed: playerDefaultSpeed,
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: ballDefaultSpeed,
    directionX: Math.random() > 0.5 ? 1 : -1,
    directionY: Math.random() > 0.5 ? 1 : -1
};

const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

function newRound() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = ballDefaultSpeed;
    player1.speed = playerDefaultSpeed;
    player2.speed = playerDefaultSpeed;
}

function gameLoop() {
    // Handle player movement
    player1.direction = keys.w ? -1 : (keys.s ? 1 : 0);
    player2.direction = keys.ArrowUp ? -1 : (keys.ArrowDown ? 1 : 0);

    // Move players and ball
    player1.y += player1.direction * player1.speed;
    player2.y += player2.direction * player2.speed;
    ball.x += ball.directionX * ball.speed;
    ball.y += ball.directionY * ball.speed;

    // Ball collisions
    if (ball.y < 0 || ball.y > canvas.height - 10) ball.directionY *= -1;
    if (ball.x < 0) {
        player2.score++;
        ball.directionX = 1;
        newRound();
    }
    if (ball.x > canvas.width - 10) {
        player1.score++;
        ball.directionX = -1;
        newRound();
    }

    // Check if the ball is colliding with either player1 OR player2
    if (ball.x < player1.x && ball.y > player1.y && ball.y < player1.y + 100 || 
        ball.x > player2.x && ball.y > player2.y && ball.y < player2.y + 100) {
        ball.directionX *= -1;
        ball.speed += 0.5;
        player1.speed += 0.5;
        player2.speed += 0.5;
    }

    draw();
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(player1.x, player1.y, 10, 100);
    ctx.fillRect(player2.x, player2.y, 10, 100);

    ctx.fillStyle = 'red';
    ctx.fillRect(ball.x, ball.y, 10, 10);

    ctx.font = '30px Arial';
    ctx.fillText(player1.score, 100, 100);
    ctx.fillText(player2.score, canvas.width - 100, 100);
}

window.addEventListener('keydown', (event) => {
    if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        keys[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        keys[event.key] = false;
    }
});

gameLoop();
