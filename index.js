
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let default_player_speed = 2;
let player_speed = 2;

let p1_currentY = 0;
let p1_direction = 0;

let p2_currentY = 0;
let p2_direction = 0;

let p1_score = 0;
let p2_score = 0;

let ball_x = 0;
let ball_y = 0;
let default_ball_speed = 2;
let ball_speed = 2;
let ball_direction_x = 1;
let ball_direction_y = 1;

let key_w = false;
let key_s = false;
let key_up = false;
let key_down = false;

function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    p1_currentY = canvas.height / 2;
    p2_currentY = canvas.height / 2;
    window.requestAnimationFrame(gameLoop);

    ball_x = canvas.width / 2;
    ball_y = canvas.height / 2;

    ball_direction_x = Math.random() > 0.5 ? 1 : -1;
    ball_direction_y = Math.random() > 0.5 ? 1 : -1;

    if (canvas.width > 1000) {
        default_ball_speed = 3;
        ball_speed = 3;
    }
}
setup();

function gameLoop() {

    // Setup movement

    if (key_w) {
        p1_direction = -1;
    } else if (key_s) {
        p1_direction = 1;
    } else {
        p1_direction = 0;
    }

    if (key_up) {
        p2_direction = -1;
    } else if (key_down) {
        p2_direction = 1;
    } else {
        p2_direction = 0;
    }

    // Do movement

    p1_currentY += p1_direction * player_speed;
    p2_currentY += p2_direction * player_speed;

    ball_x += ball_direction_x * ball_speed;
    ball_y += ball_direction_y * ball_speed;

    // Check for collisions

    if (ball_y < 0) {
        ball_direction_y = 1;
    }
    if (ball_y > canvas.height - 10) {
        ball_direction_y = -1;
    }

    if (ball_x < 0) {
        ball_direction_x = 1;
        ball_x = canvas.width / 2;
        ball_y = canvas.height / 2;
        p2_score++;
        ball_speed = default_ball_speed;
        player_speed = default_player_speed;
    }
    if (ball_x > canvas.width - 10) {
        ball_direction_x = -1;
        ball_x = canvas.width / 2;
        ball_y = canvas.height / 2;
        p1_score++;
        ball_speed = default_ball_speed;
        player_speed = default_player_speed;
    }
    
    if (ball_x < 20 && ball_y > p1_currentY && ball_y < p1_currentY + 100) {
        ball_direction_x = 1;
        ball_speed += 0.5;
        player_speed += 0.5;
    }
    if (ball_x > canvas.width - 30 && ball_y > p2_currentY && ball_y < p2_currentY + 100) {
        ball_direction_x = -1;
        ball_speed += 0.5;
        player_speed += 0.5;
    }

    // Draw
    draw();
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(10, p1_currentY, 10, 100);

    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width - 20, p2_currentY, 10, 100);

    ctx.fillStyle = 'red';
    ctx.fillRect(ball_x, ball_y, 10, 10);

    ctx.font = '30px Arial';
    ctx.fillText(p1_score, 100, 100);
    ctx.fillText(p2_score, canvas.width - 100, 100);
    
}


window.addEventListener('keydown', onKeyDown);
function onKeyDown(event) {
    if (event.key === 'w') {
        key_w = true;
    }
    if (event.key === 's') {
        key_s = true;
    }
    if (event.key === 'ArrowUp') {
        key_up = true;
    }
    if (event.key === 'ArrowDown') {
        key_down = true;
    }
}

window.addEventListener('keyup', onKeyUp);
function onKeyUp(event) {
    if (event.key === 'w') {
        key_w = false;
    }
    if (event.key === 's') {
        key_s = false;
    }
    if (event.key === 'ArrowUp') {
        key_up = false;
    }
    if (event.key === 'ArrowDown') {
        key_down = false;
    }
}