/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let input = {
    left: false,
    right: false,
};

let player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    direction: 'none',
};

// BULLETS
let bullets = [];
let lastBulletShotTime = 0;
setInterval(function () {
    bullets.push({
        x: player.x + 5,
        y: player.y,
    });
}, 100);

// ENEMIES
let enemies = [];
let lastEnemySpawnTime = 0;
setInterval(function () {
    enemies.push({
        x: Math.random() * canvas.width,
        y: -20,
    });
}, 200);

// GAME LOOP
let lastTime = 0;
window.requestAnimationFrame(gameLoop);
function gameLoop(time) {
    let delta = time - lastTime; // Time since last frame
    lastTime = time;

    // INPUT LOGIC
    if (input.left && player.direction != 'left') {
        player.direction = 'left';
    } else if (input.right && player.direction != 'right') {
        player.direction = 'right';
    } else if (!input.left && !input.right) {
        player.direction = 'none';
    }

    // PLAYER LOGIC
    if (player.direction === 'left') {
        player.x -= 0.5 * delta;
    } else if (player.direction === 'right') {
        player.x += 0.5 * delta;
    }

    // BULLET LOGIC
    for (let bullet of bullets) {
        bullet.y -= 5;
        for (let enemy of enemies) {
            if (colliding(bullet, enemy)) {
                // Remove bullet from list
                bullets.splice(bullets.indexOf(bullet), 1);
                // Remove enemy from list
                enemies.splice(enemies.indexOf(enemy), 1);
            }
        }
    }

    // ENEMY LOGIC
    for (let enemy of enemies) {
        enemy.y += 1.5;
        if (enemy.y > canvas.height) {
            // Game over
            ctx.fillStyle = 'white';
            ctx.font = '48px sans-serif';
            ctx.fillText(
                'Game Over',
                canvas.width / 2 - 120,
                canvas.height / 2
            );

            return; // Stops the game loop
        }
    }

    // DRAWING
    draw();
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(player.x, player.y, 20, 20);

    ctx.fillStyle = 'white';
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    }

    ctx.fillStyle = 'red';
    for (let enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, 20, 20);
    }
}

function colliding(a, b) {
    return a.x < b.x + 20 && a.x + 20 > b.x && a.y < b.y + 20 && a.y + 20 > b.y;
}


// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        input.left = true;
    } else if (event.key === 'ArrowRight') {
        input.right = true;
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        input.left = false;
    } else if (event.key === 'ArrowRight') {
        input.right = false;
    }
});


// BONUS: TAP CONTROLS
document.addEventListener(
    'touchstart',
    (event) => {
        if (event.changedTouches[0].clientX < canvas.width / 2) {
            input.left = true;
        } else {
            input.right = true;
        }
        // Prevent default behavior, like scrolling, zooming and long-press menus.
        event.preventDefault();
        event.stopPropagation();
    },
    { passive: false }
);
document.addEventListener('touchend', (event) => {
    if (event.changedTouches[0].clientX < canvas.width / 2) {
        input.left = false;
    } else {
        input.right = false;
    }
});