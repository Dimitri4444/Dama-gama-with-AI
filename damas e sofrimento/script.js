const BOARD_SIZE = 8;
        const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
        const boardElement = document.getElementById('board');

        let selectedPiece = null;
        let currentPlayer = 'player';
        let gameMode = 'player-vs-player'; // Default mode

        function setMode(mode) {
            gameMode = mode;
            alert(`Game mode set to: ${mode}`);
            resetGame();
        }

        function initBoard() {
            boardElement.innerHTML = '';
            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    if ((row + col) % 2 === 0) {
                        cell.classList.add('white');
                    } else {
                        cell.classList.add('black');
                        if (row < 3) {
                            board[row][col] = 'ai';
                        } else if (row > 4) {
                            board[row][col] = 'player';
                        }
                    }
                    cell.addEventListener('click', handleClick);
                    boardElement.appendChild(cell);
                }
            }
            renderBoard();
        }

        function renderBoard() {
            const cells = boardElement.children;
            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    const index = row * BOARD_SIZE + col;
                    const cell = cells[index];
                    cell.innerHTML = '';
                    const pieceType = board[row][col];
                    if (pieceType) {
                        const piece = document.createElement('div');
                        piece.classList.add('piece', pieceType);
                        cell.appendChild(piece);
                    }
                }
            }
        }

        function isMoveValid(player, fromRow, fromCol, toRow, toCol) {
            if (toRow < 0 || toRow >= BOARD_SIZE || toCol < 0 || toCol >= BOARD_SIZE) {
                return false; // Out of bounds
            }
            if (board[toRow][toCol] !== null) {
                return false; // Target cell not empty
            }
            const direction = player === 'player' ? -1 : 1;
            return (
                (toRow === fromRow + direction && Math.abs(toCol - fromCol) === 1) // Regular move
            );
        }

        function movePiece(fromRow, fromCol, toRow, toCol) {
            board[toRow][toCol] = board[fromRow][fromCol];
            board[fromRow][fromCol] = null;
            renderBoard();
        }

        function handleClick(event) {
            const cell = event.target.closest('.cell');
            if (!cell) return;

            const index = Array.from(boardElement.children).indexOf(cell);
            const row = Math.floor(index / BOARD_SIZE);
            const col = index % BOARD_SIZE;

            if (gameMode === 'ai-vs-ai') {
                alert('AI vs AI mode is running! Reset the game to switch modes.');
                return;
            }

            if (selectedPiece) {
                // Try to move to the clicked cell
                const [fromRow, fromCol] = selectedPiece;
                if (isMoveValid(currentPlayer, fromRow, fromCol, row, col)) {
                    movePiece(fromRow, fromCol, row, col);
                    selectedPiece = null;

                    if (gameMode === 'player-vs-player') {
                        currentPlayer = currentPlayer === 'player' ? 'ai' : 'player';
                    } else if (gameMode === 'player-vs-ai') {
                        makeAIMove();
                    }
                } else {
                    alert('Invalid move!');
                }
            } else if (board[row][col] === currentPlayer) {
                // Select the clicked piece
                selectedPiece = [row, col];
                console.log(`Selected piece at ${row}, ${col}`);
            }
        }

        function makeAIMove() {
            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (board[row][col] === 'ai') {
                        const toRow = row + 1;
                        const toColLeft = col - 1;
                        const toColRight = col + 1;
                        if (isMoveValid('ai', row, col, toRow, toColLeft)) {
                            movePiece(row, col, toRow, toColLeft);
                            return;
                        } else if (isMoveValid('ai', row, col, toRow, toColRight)) {
                            movePiece(row, col, toRow, toColRight);
                            return;
                        }
                    }
                }
            }
        }

        function runAIvsAI() {
            if (gameMode !== 'ai-vs-ai') return;
            let aiTurn = 'ai';
            const aiInterval = setInterval(() => {
                for (let row = 0; row < BOARD_SIZE; row++) {
                    for (let col = 0; col < BOARD_SIZE; col++) {
                        if (board[row][col] === aiTurn) {
                            const toRow = aiTurn === 'ai' ? row + 1 : row - 1;
                            const toColLeft = col - 1;
                            const toColRight = col + 1;
                            if (isMoveValid(aiTurn, row, col, toRow, toColLeft)) {
                                movePiece(row, col, toRow, toColLeft);
                                aiTurn = aiTurn === 'ai' ? 'player' : 'ai';
                                return;
                            } else if (isMoveValid(aiTurn, row, col, toRow, toColRight)) {
                                movePiece(row, col, toRow, toColRight);
                                aiTurn = aiTurn === 'ai' ? 'player' : 'ai';
                                return;
                            }
                        }
                    }
                }
            }, 1000);

            setTimeout(() => clearInterval(aiInterval), 60000); // Stops after 1 minute
        }

        function resetGame() {
            selectedPiece = null;
            currentPlayer = 'player';
            initBoard();
            if (gameMode === 'ai-vs-ai') {
                runAIvsAI();
            }
        }

    initBoard();