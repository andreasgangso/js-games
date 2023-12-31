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
};

// BULLETS
let bullets = [];
setInterval(function () {
    bullets.push({
        x: player.x + 5,
        y: player.y,
    });
}, 100);

// ENEMIES
let enemies = [];
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

    // PLAYER LOGIC
    if (input.left) {
        player.x -= 0.5 * delta;
    } else if (input.right) {
        player.x += 0.5 * delta;
    }

    // BULLET LOGIC
    for (let bullet of bullets) {
        bullet.y -= 0.5 * delta;
        for (let enemy of enemies) {
            if (colliding(bullet, enemy)) {
                bullets = bullets.filter(b => b !== bullet);
                enemies = enemies.filter(e => e !== enemy);
            }
        }
    }

    // ENEMY LOGIC
    for (let enemy of enemies) {
        enemy.y += 0.15 * delta;
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

function colliding(bullet, enemy) {
    let topOfBullet = bullet.y;
    let bottomOfEnemy = enemy.y + 20;
    let topOfEnemy = enemy.y;

    let leftSideOfBullet = bullet.x;
    let rightSideOfBullet = bullet.x + 10;
    let leftSideOfEnemy = enemy.x;
    let rightSideOfEnemy = enemy.x + 20;

    if (topOfBullet < bottomOfEnemy && topOfBullet > topOfEnemy) {
        if (leftSideOfBullet > leftSideOfEnemy && leftSideOfBullet < rightSideOfEnemy) {
            return true;
        } else if (rightSideOfBullet > leftSideOfEnemy && rightSideOfBullet < rightSideOfEnemy) {
            return true;
        }
    }
    return false;
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