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
            
            if (backgroundColorTable[i][j]) {
                cell.style.backgroundColor = backgroundColorTable[i][j];
            }

            let touchStartTime = 0;
            let touchTimer = null;
            
            cell.ontouchstart = (e) => {
                e.preventDefault();
                touchStartTime = Date.now();
                touchTimer = setTimeout(() => {
                    deleteCell(i, j);
                }, 500); // Long press for delete
            };
            
            cell.ontouchend = (e) => {
                e.preventDefault();
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    if (Date.now() - touchStartTime < 500) {
                        selectCell(i, j); // Short tap for select
                    }
                }
            };
            
            cell.ontouchcancel = (e) => {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                }
            };

            cell.onclick = () => selectCell(i, j);
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                deleteCell(i, j);
            };
        }
        }
}

function toggleTempValues() {
    showTempValues = !showTempValues;
    localStorage.setItem('showTempValues', showTempValues);
    document.getElementById('tempToggle').textContent = showTempValues ? 'Hide Partial Selection' : 'Show Partial Selection';
    renderTable();
}

function showInfo() {
    const box = document.getElementById('instructionsBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}