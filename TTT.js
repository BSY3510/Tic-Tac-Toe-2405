const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let aiEnabled = false;

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

document.getElementById('ai-btn').addEventListener('click', toggleAI);

function handleClick() {
    const cellIndex = parseInt(this.id.split('-')[1]);

    if (gameBoard[cellIndex] == '') {
        this.innerText = currentPlayer;
        gameBoard[cellIndex] = currentPlayer;
        if (checkWinner()) {
            alert(currentPlayer + ' wins!');
            resetGame();
        } else if (!gameBoard.includes('')) {
            alert('Draw!');
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (aiEnabled && currentPlayer === 'O') {
                setTimeout(() => {
                    aiMove();
                }, 500);
            }
        }
    }
}

function toggleAI() {
    aiEnabled = !aiEnabled;
    if (aiEnabled) {
        this.innerText = 'AI 비활성화';
    } else {
        this.innerText = 'AI 활성화';
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    gameBoard[move] = 'O';
    document.getElementById('cell-' + move).innerText = 'O';

    if (checkWinner()) {
        alert('AI wins!');
        resetGame();
    } else if (!gameBoard.includes('')) {
        alert('Draw!');
        resetGame();
    } else {
        currentPlayer = 'X';
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner() && currentPlayer === 'O') {
        return 1;
    } else if (checkWinner() && currentPlayer === 'X') {
        return -1;
    } else if (!gameBoard.includes('')) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}


function checkWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombos.some(combo => {
        return combo.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.innerText = '';
    });
}
