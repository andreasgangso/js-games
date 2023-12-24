/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dead = false;
const alive = true;

const gameSpeed = 250;
const gridSize = 10;

let playing = false;

let grid = [];

const columns = Math.floor(canvas.width / gridSize);
const rows = Math.floor(canvas.height / gridSize);

// Init the grid. Initially all cells are dead.
for (let column = 0; column < columns; column++) {
    grid[column] = [];

    for (let row = 0; row < rows; row++) {
        grid[column][row] = dead;
    }
}

function nextGameCycle() {
    applyRules();

    if (playing) {
        window.setTimeout(nextGameCycle, gameSpeed);
    }
}

function countNeighbours(column, row) {
    let neighbours = 0;

    // left neighbours
    if (column - 1 >= 0) {
        if (grid[column - 1][row - 1] === alive) neighbours += 1;
        if (grid[column - 1][row] === alive) neighbours += 1;
        if (grid[column - 1][row + 1] === alive) neighbours += 1;
    }

    // top/bottom neighbours
    if (column - 1 >= 0) {
        if (grid[column][row - 1] === alive) neighbours += 1;
        // Don't count itself as neighbour
        if (grid[column][row + 1] === alive) neighbours += 1;
    }

    // right neighbours
    if (column + 1 < grid.length) {
        if (grid[column + 1][row - 1] === alive) neighbours += 1;
        if (grid[column + 1][row] === alive) neighbours += 1;
        if (grid[column + 1][row + 1] === alive) neighbours += 1;
    }

    return neighbours;
}

function applyRules() {
    // We need to create a new grid where we note the status of every neighbour. Cells where we know the new status should
    // not have an effect on cells we check later.
    const newGrid = [];

    for (let column = 0; column < grid.length; column++) {
        newGrid[column] = [];

        for (let row = 0; row < grid[column].length; row++) {
            const neighbours = countNeighbours(column, row);

            if (
                grid[column][row] === alive &&
                (neighbours === 2 || neighbours === 3)
            ) {
                // Any live cell with two or three live neighbours survives.
                newGrid[column][row] = alive;
            } else if (grid[column][row] === dead && neighbours === 3) {
                // Any dead cell with three live neighbours becomes a live cell.
                newGrid[column][row] = alive;
            } else {
                // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                newGrid[column][row] = dead;
            }
        }
    }

    grid = newGrid;
}

function gameLoop() {
    draw();

    window.requestAnimationFrame(gameLoop);
}

gameLoop();

function draw() {
    // Draw all in white - clear our canvas.
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all cells
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            const x = column * gridSize;
            const y = row * gridSize;

            if (grid[column][row] === dead) {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = 'black';
            }
            ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
        }
    }
}

document.addEventListener('click', function (e) {
    // Get indexes of the element of the grid the user clicked on
    const rect = canvas.getBoundingClientRect();
    const column = Math.floor((e.clientX - rect.left) / gridSize);
    const row = Math.floor((e.clientY - rect.top) / gridSize);

    // Set new status of the field
    if (grid.length >= column && grid[column].length >= row) {
        if (grid[column][row] === dead) {
            grid[column][row] = alive;
        } else {
            grid[column][row] = dead;
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        if (playing) {
            playing = false;
        } else {
            playing = true;
            nextGameCycle();
        }
    }
});
