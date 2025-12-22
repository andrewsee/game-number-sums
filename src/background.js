const allColors = [
    '#ffeeee',
    '#eeffee',
    '#eeeeff',
    '#ffffee',
    '#ffeeff',
    '#eeffff',
    '#fff0e6',
    '#f0e6ff'
];

function prepareBackgroundTable(size) {
    const tempTable = Array(size).fill().map(() => Array(size).fill(null));
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
            tempTable[row][col] = lightColors[colorIndex];
        });
    }
    precomputedBackgrounds[`${size}`].push(tempTable)
}

function precomputeBackgrounds() {
    setTimeout(() => loopForCreation(), 10000);
}

function loopForCreation() {
    for (let i = 0; i < 3; i++) {
        for (let s = 4; s <= 7 && precomputedBackgrounds[`${s}`].length < 4; s++) {
            setTimeout(function(size) {
                if (precomputedBackgrounds[`${s}`].length < 4) {
                    prepareBackgroundTable(size)
                }
            }, (i + 1) * (i + 1) * (8 - s) * 10000, s);
        }
    }
}
