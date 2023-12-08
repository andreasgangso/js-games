/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const dead = false;
const alive = true;

let playing = false;

let grid = [];

function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rows = Math.floor(canvas.width / 10);
    const columns = Math.floor(canvas.height / 10);

    for (let row = 0; row < rows; row++) {
        grid[row] = [];

        for (let column = 0; column < columns; column++) {
            grid[row][column] = dead;
        }
    }

    draw();
}
setup();

function nextCycle() {
    applyRules();
    draw();

    if (playing) {
        window.setTimeout(nextCycle, 250);
    }
}

function countNeighbours(row, column) {
    let neighbours = 0;

    // left neighbours
    if (row - 1 >= 0) {
        if (grid[row - 1][column - 1] === alive) neighbours += 1;
        if (grid[row - 1][column] === alive) neighbours += 1;
        if (grid[row - 1][column + 1] === alive) neighbours += 1;
    }

    // top/bottom neighbours
    if (row - 1 >= 0) {
        if (grid[row][column - 1] === alive) neighbours += 1;
        // Don't count itself as neighbour
        if (grid[row][column + 1] === alive) neighbours += 1;
    }

    // right neighbours
    if (row + 1 < grid.length) {
        if (grid[row + 1][column - 1] === alive) neighbours += 1;
        if (grid[row + 1][column] === alive) neighbours += 1;
        if (grid[row + 1][column + 1] === alive) neighbours += 1;
    }

    return neighbours;
}

function applyRules() {
    // We need to create a new grid where we note the status of every neighbour. Cells where we know the new status should
    // not have an effect on cells we check later.
    const newGrid = [];

    for (let row = 0; row < grid.length; row++) {
        newGrid[row] = [];

        for (let column = 0; column < grid[row].length; column++) {
            const neighbours = countNeighbours(row, column);

            if (grid[row][column] === alive && (neighbours === 2 || neighbours === 3)) {
                // Any live cell with two or three live neighbours survives.
                newGrid[row][column] = alive;
            } else if (grid[row][column] === dead && neighbours === 3) {
                // Any dead cell with three live neighbours becomes a live cell.
                newGrid[row][column] = alive;
            } else {
                // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                newGrid[row][column] = dead;
            }
        }
    }

    grid = newGrid;
}

function draw() {
    // Draw all in white - clear our canvas.
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all cells
    for (let row = 0; row < grid.length; row++) {
        for (let column = 0; column < grid[row].length; column++) {
            const x = row * 10;
            const y = column * 10;

            ctx.fillStyle = 'gray';
            ctx.fillRect(x, y, 10, 10);

            if (grid[row][column] === dead) {
                ctx.fillStyle = 'white';
                ctx.fillRect(x, y, 9, 9);
            } else {
                ctx.fillStyle = 'black';
                ctx.fillRect(x, y, 9, 9);
            }
        }
    }
}

canvas.addEventListener('click', function (e) {
    // Get indexes of the element of the grid the user clicked on
    const rect = canvas.getBoundingClientRect();
    const row = Math.floor((e.clientX - rect.left) / 10);
    const column = Math.floor((e.clientY - rect.top) / 10);

    if (grid.length >= row && grid[row].length >= column) {
        if (grid[row][column] === dead) {
            grid[row][column] = alive;
        } else {
            grid[row][column] = dead;
        }
    }

    draw();
})

document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        if (playing) {
            playing = false;
        } else {
            playing = true;
            nextCycle();
        }
    }
});
