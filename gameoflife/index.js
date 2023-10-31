
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

    for (let i = 0; i < rows; i++) {
        grid[i] = [];

        for (let j = 0; j < columns; j++) {
            grid[i][j] = dead;
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

function countNeighbours(x, y) {
    let neighbours = 0;

    // left neighbours
    if (x - 1 >= 0) {
        if (grid[x - 1][y - 1] === alive) neighbours += 1;
        if (grid[x - 1][y] === alive) neighbours += 1;
        if (grid[x - 1][y + 1] === alive) neighbours += 1;
    }

    // top/bottom neighbours
    if (x - 1 >= 0) {
        if (grid[x][y - 1] === alive) neighbours += 1;
        // Don't count itself as neighbour
        if (grid[x][y + 1] === alive) neighbours += 1;
    }

    // right neighbours
    if (x + 1 < grid.length) {
        if (grid[x + 1][y - 1] === alive) neighbours += 1;
        if (grid[x + 1][y] === alive) neighbours += 1;
        if (grid[x + 1][y + 1] === alive) neighbours += 1;
    }

    return neighbours;
}

function applyRules() {
    // We need to create a new grid where we note the status of every neighbour. Cells where we know the new status should
    // not have an effect on cells we check later.
    const newGrid = [];

    for (let i = 0; i < grid.length; i++) {
        newGrid[i] = [];

        for (let j = 0; j < grid[i].length; j++) {
            const neighbours = countNeighbours(i, j);

            if (grid[i][j] === alive && (neighbours === 2 || neighbours === 3)) {
                // Any live cell with two or three live neighbours survives.
                newGrid[i][j] = alive;
            } else if (grid[i][j] === dead && neighbours === 3) {
                // Any dead cell with three live neighbours becomes a live cell.
                newGrid[i][j] = alive;
            } else {
                // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                newGrid[i][j] = dead;
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
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const x = i * 10;
            const y = j * 10;

            ctx.fillStyle = 'gray';
            ctx.fillRect(x, y, 10, 10);

            if (grid[i][j] === dead) {
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
    const x = Math.floor((e.clientX - rect.left) / 10);
    const y = Math.floor((e.clientY - rect.top) / 10);

    if (grid.length >= x && grid[x].length >= y) {
        if (grid[x][y] === dead) {
            grid[x][y] = alive;
        } else {
            grid[x][y] = dead;
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
})
