/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const speed = 1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const direction = {
    none: 0,
    up: 1,
    down: 2,
    left: 3,
    right: 4,
}

let keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

let player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    direction: direction.none,
}

let bullets = []

let lastTime = 0;
function gameLoop(time) {
    let delta = time - lastTime;
    lastTime = time;
    console.log(delta)
    if (keys.w && player.direction != direction.up) {
        player.direction = direction.up;
    } else if (keys.a && player.direction != direction.left) {
        player.direction = direction.left;
    } else if (keys.s && player.direction != direction.down) {
        player.direction = direction.down;
    } else if (keys.d && player.direction != direction.right) {
        player.direction = direction.right;
    } else {
        player.direction = direction.none;
    }



    if (player.direction === direction.up) {
        player.y -= speed * delta;
    } else if (player.direction === direction.down) {
        player.y += speed * delta;
    }
    if (player.direction === direction.left) {
        player.x -= speed * delta;
    } else if (player.direction === direction.right) {
        player.x += speed * delta;
    }

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 5;
    }


    draw();
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(player.x, player.y, 20, 20);

    ctx.fillStyle = 'white';
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x, bullets[i].y, 5, 10);
    }
}

function shootBullet() {
    bullets.push({
        x: player.x + 5,
        y: player.y,
    });
}

function handleKeyDown(event) {
    if (event.key === ' ') {
        shootBullet();
    }
    if (['w', 'a', 's', 'd'].includes(event.key)) {
        keys[event.key] = true;
    }
}

function handleKeyUp(event) {
    if (['w', 'a', 's', 'd'].includes(event.key)) {
        keys[event.key] = false;
    }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
window.requestAnimationFrame(gameLoop);