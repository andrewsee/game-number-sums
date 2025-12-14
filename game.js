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

function renderTable() {
    const tableEl = document.getElementById('gameTable');
    tableEl.innerHTML = '';
    tableEl.className = `size-${size}`;

    // Calculate summaries
    const rowGreenSums = Array(size).fill(0);
    const rowRedSums = Array(size).fill(0);
    const colGreenSums = Array(size).fill(0);
    const colRedSums = Array(size).fill(0);
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (table[i][j] !== 0) {
                if (colorTable[i][j] === 'green') {
                    rowGreenSums[i] += table[i][j];
                    colGreenSums[j] += table[i][j];
                } else if (colorTable[i][j] === 'red') {
                    rowRedSums[i] += table[i][j];
                    colRedSums[j] += table[i][j];
                }
            }
        }
    }

    // Header row with column sums
    const headerRow = tableEl.insertRow();
    headerRow.insertCell().className = 'sum-cell';
    for (let j = 0; j < size; j++) {
        const cell = headerRow.insertCell();
        cell.textContent = showTempValues ? `${colSums[j]} / ${colGreenSums[j] + colRedSums[j]}` : `${colSums[j]}`;
        cell.className = 'sum-cell';
    }

    // Data rows
    for (let i = 0; i < size; i++) {
        const row = tableEl.insertRow();
        
        // Row sum cell
        const sumCell = row.insertCell();
        sumCell.textContent = showTempValues ? `${rowSums[i]} / ${rowGreenSums[i] + rowRedSums[i]}` : `${rowSums[i]}`;
        sumCell.className = 'sum-cell';

        // Data cells
        for (let j = 0; j < size; j++) {
            const cell = row.insertCell();
            
            if (deletedTable[i][j]) {
                cell.textContent = '';
            } else if (colorTable[i][j] === 'red') {
                const displayValue = table[i][j] === 0 ? maskTable[i][j] : table[i][j];
                if (table[i][j] === 0) {
                    cell.innerHTML = `<span class="red-circle" style="color: white;">${displayValue}</span>`;
                } else {
                    cell.innerHTML = `<span class="red-circle">${displayValue}</span>`;
                }
            } else if (colorTable[i][j] === 'green') {
                if (table[i][j] === 0) {
                    cell.innerHTML = `<span class="green-circle" style="color: white;">${maskTable[i][j]}</span>`;
                } else {
                    cell.innerHTML = `<span class="green-circle">${table[i][j]}</span>`;
                }
            } else if (table[i][j] === 0) {
                cell.textContent = maskTable[i][j];
            } else {
                cell.textContent = table[i][j];
            }

            cell.onclick = () => selectCell(i, j);
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                deleteCell(i, j);
            };
        }
        }
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