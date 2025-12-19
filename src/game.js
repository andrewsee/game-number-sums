let size = 6;
let table = [];
let maskTable = [];
let deletedTable = [];
let colorTable = [];
let backgroundColorTable = [];
let colSums = [];
let rowSums = [];
let gameOver = false;
let showTempValues = true;
let hintsRemaining = 3;

function newGame(newSize) {
    size = newSize;
    if (newSize === 0) {
        size = Math.floor(Math.random() * 5) + 4;
    }
    gameOver = false;
    hintsRemaining = 3;
    document.getElementById('gameTable').style.display = 'table';
    document.getElementById('status').style.display = 'block';
    document.getElementById('gameButtons').style.display = 'block';
    document.getElementById('hintButton').textContent = 'Show Hint (3)';
    document.getElementById('hintButton').disabled = false;
    document.getElementById('tempToggle').disabled = false;
    showTempValues = localStorage.getItem('showTempValues') !== 'false';
    document.getElementById('tempToggle').textContent = showTempValues ? 'Hide Partial Selection' : 'Show Partial Selection';
    initGame();
}

function checkEveryNotZero() {
    for (let i = 0; i < size; i++) {
        if (table[i].every(cell => cell === 0)) {
            table[i][Math.floor(Math.random() * size)] = Math.floor(Math.random() * 9) + 1;
        }
    }
    for (let j = 0; j < size; j++) {
        if (table.every(row => row[j] === 0)) {
            table[Math.floor(Math.random() * size)][j] = Math.floor(Math.random() * 9) + 1;
        }
    }
}

function addColors() {
    const allColors = ['#ffeeee', '#eeffee', '#eeeeff', '#ffffee', '#ffeeff', '#eeffff', '#fff0e6', '#f0e6ff'];
    const lightColors = allColors.slice(0, size);
    const visited = Array(size).fill().map(() => Array(size).fill(false));
    const path = [];
    
    function backtrack(row, col) {
        if (path.length === size * size) return true;
        if (row < 0 || row >= size || col < 0 || col >= size || visited[row][col]) return false;
        
        visited[row][col] = true;
        path.push([row, col]);
        
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        directions.sort(() => Math.random() - 0.5);
        
        for (const [dr, dc] of directions) {
            if (backtrack(row + dr, col + dc)) return true;
        }
        
        visited[row][col] = false;
        path.pop();
        return false;
    }
    
    if (backtrack(2, 2)) {
        path.forEach(([row, col], i) => {
            const colorIndex = Math.floor(i / size) % lightColors.length;
            backgroundColorTable[row][col] = lightColors[colorIndex];
        });
    }
}

function initGame() {
    table = Array(size).fill().map(() => Array(size).fill().map(() =>
        Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 9) + 1
    ));

    checkEveryNotZero()

    maskTable = Array(size).fill().map(() => Array(size).fill().map(() => 
        Math.floor(Math.random() * 9) + 1
    ));
    deletedTable = Array(size).fill().map(() => Array(size).fill(false));
    colorTable = Array(size).fill().map(() => Array(size).fill(null));
    backgroundColorTable = Array(size).fill().map(() => Array(size).fill(null));
    
    addColors();

    colSums = Array(size).fill().map((_, j) => 
        table.reduce((sum, row) => sum + (row[j] !== 0 ? row[j] : 0), 0)
    );
    rowSums = table.map(row => 
        row.reduce((sum, cell) => sum + (cell !== 0 ? cell : 0), 0)
    );

    renderTable();
    updateStatus();
}