let size = 6;
let table = [];
let maskTable = [];
let deletedTable = [];
let colorTable = [];
let colSums = [];
let rowSums = [];
let gameOver = false;
let showTempValues = true;
let hintsRemaining = 3;

function initGame() {
    table = Array(size).fill().map(() => Array(size).fill().map(() => 
        Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 9) + 1
    ));
    
    // Ensure no row or column is all zeros
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

    maskTable = Array(size).fill().map(() => Array(size).fill().map(() => 
        Math.floor(Math.random() * 9) + 1
    ));
    deletedTable = Array(size).fill().map(() => Array(size).fill(false));
    colorTable = Array(size).fill().map(() => Array(size).fill(null));

    colSums = Array(size).fill().map((_, j) => 
        table.reduce((sum, row) => sum + (row[j] !== 0 ? row[j] : 0), 0)
    );
    rowSums = table.map(row => 
        row.reduce((sum, cell) => sum + (cell !== 0 ? cell : 0), 0)
    );

    renderTable();
    updateStatus();
}

function selectCell(i, j) {
    if (gameOver || colorTable[i][j] !== null || deletedTable[i][j]) return;

    if (table[i][j] === 0) {
        colorTable[i][j] = 'red';
        deletedTable[i][j] = true;
    } else {
        colorTable[i][j] = 'green';
    }

    checkAutoComplete(i, j);
    renderTable();
    updateStatus();
}

function checkAutoComplete(row, col) {
    // Check row completion
    let rowComplete = true;
    for (let j = 0; j < size; j++) {
        if (table[row][j] !== 0 && colorTable[row][j] === null) {
            rowComplete = false;
            break;
        }
    }
    if (rowComplete) {
        for (let j = 0; j < size; j++) {
            if (table[row][j] === 0 && colorTable[row][j] === null) {
                colorTable[row][j] = 'green';
                deletedTable[row][j] = true;
            }
        }
    }

    // Check column completion
    let colComplete = true;
    for (let i = 0; i < size; i++) {
        if (table[i][col] !== 0 && colorTable[i][col] === null) {
            colComplete = false;
            break;
        }
    }
    if (colComplete) {
        for (let i = 0; i < size; i++) {
            if (table[i][col] === 0 && colorTable[i][col] === null) {
                colorTable[i][col] = 'green';
                deletedTable[i][col] = true;
            }
        }
    }
}

function deleteCell(i, j) {
    if (gameOver || colorTable[i][j] !== null || deletedTable[i][j]) return;

    if (table[i][j] === 0) {
        deletedTable[i][j] = true;
        colorTable[i][j] = 'green';
    } else {
        colorTable[i][j] = 'red';
    }
    checkAutoComplete(i, j);
    renderTable();
    updateStatus();
}

function updateStatus() {
    const redCount = colorTable.flat().filter(color => color === 'red').length;
    const allColored = colorTable.every((row, i) => 
        row.every((color, j) => color !== null || deletedTable[i][j])
    );

    const statusEl = document.getElementById('status');
    
    if (redCount >= 3) {
        statusEl.textContent = 'Game Over! No lives remaining.';
        statusEl.style.color = 'red';
        gameOver = true;
        showTempValues = false;
        document.getElementById('tempToggle').disabled = true;
        renderTable();
    } else if (allColored) {
        statusEl.textContent = 'Game Complete!';
        statusEl.style.color = 'green';
        showTempValues = false;
        document.getElementById('tempToggle').disabled = true;
        renderTable();
    } else {
        statusEl.innerHTML = `<span style="font-size: 2em; color: red;">${'♥'.repeat(3 - redCount)}</span>`;
        statusEl.style.color = 'black';
    }
}

function setDifficulty(newSize) {
    size = newSize;
    if (newSize === 0) {
        size = Math.floor(Math.random() * 5) + 4;
    }
    newGame();
}

function toggleTempValues() {
    showTempValues = !showTempValues;
    document.getElementById('tempToggle').textContent = showTempValues ? 'Hide Partial Selection' : 'Show Partial Selection';
    renderTable();
}

function showHint() {
    if (gameOver || hintsRemaining <= 0) return;
    
    const availableCells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (colorTable[i][j] === null && !deletedTable[i][j]) {
                availableCells.push([i, j]);
            }
        }
    }
    
    if (availableCells.length === 0) return;
    
    const [i, j] = availableCells[Math.floor(Math.random() * availableCells.length)];
    
    if (table[i][j] === 0) {
        deleteCell(i, j);
    } else {
        selectCell(i, j);
    }
    
    hintsRemaining--;
    document.getElementById('hintButton').textContent = `Show Hint (${hintsRemaining})`;
    if (hintsRemaining <= 0) {
        document.getElementById('hintButton').disabled = true;
    }
}

function showInfo() {
    const box = document.getElementById('instructionsBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function newGame() {
    gameOver = false;
    hintsRemaining = 3;
    document.getElementById('gameTable').style.display = 'table';
    document.getElementById('status').style.display = 'block';
    document.getElementById('gameButtons').style.display = 'block';
    document.getElementById('hintButton').textContent = 'Show Hint (3)';
    document.getElementById('hintButton').disabled = false;
    document.getElementById('tempToggle').disabled = false;
    showTempValues = true;
    initGame();
}