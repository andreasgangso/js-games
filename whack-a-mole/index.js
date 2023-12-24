/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const defaultFillColour = '#5DA1B3';
const randoFillColour = '#FFF581';
const pointsPerHit = 15;

let score = 1;
const rows = 4;
const columns = 4;
const rowPadding = 10;
const colPadding = 10;

const mole = { row: 0, column: 0 };
const heightOfRow = canvas.height / rows;
const widthOfColumn = canvas.width / columns;

const cellWidth = widthOfColumn - colPadding * 2;
const cellHeight = heightOfRow - rowPadding * 2;

window.setInterval(function () {
    score -= 1;
}, 1000);

gameLoop();
nextRound();

function gameLoop() {
    draw();

    window.requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (row === mole.row && column === mole.column) {
                ctx.fillStyle = randoFillColour;
            } else {
                ctx.fillStyle = defaultFillColour;
            }

            ctx.fillRect(
                widthOfColumn * column + colPadding,
                heightOfRow * row + rowPadding,
                cellWidth,
                cellHeight
            );
        }
    }

    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function nextRound() {
    mole.row = Math.floor(Math.random() * rows);
    mole.column = Math.floor(Math.random() * columns);
}

document.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const moleX = widthOfColumn * mole.column + colPadding;
    const moleY = heightOfRow * mole.row + rowPadding;

    if (
        moleX < mouseX &&
        moleX + cellWidth > mouseX &&
        moleY < mouseY &&
        moleY + cellHeight > mouseY
    ) {
        score += pointsPerHit;
        nextRound();
    }
});
