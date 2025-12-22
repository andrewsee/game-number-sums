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
        document.getElementById('hintButton').disabled = true;
        renderTable();
    } else if (allColored) {
        statusEl.textContent = 'Game Complete!';
        statusEl.style.color = 'green';
        showTempValues = false;
        document.getElementById('tempToggle').disabled = true;
        document.getElementById('hintButton').disabled = true;
        renderTable();
    } else {
        const redHearts = '♥'.repeat(3 - redCount);
        const whiteHearts = '♥'.repeat(redCount);
        statusEl.innerHTML = `<span style="font-size: 3em; color: red;">${redHearts}</span><span style="font-size: 3em; color: black;">${whiteHearts}</span>`;
        statusEl.style.color = 'black';
    }
}