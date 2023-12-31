// gameboard module represents the state of the board 
const gameBoard = (function () {
    // store gameboard as an array 
    const gameboard = [];
    const rows = 3;
    const cols = 3;

    // fills board with arrays that contain empty cells
    for (let i = 0; i < rows; i++) {
        gameboard.push([]);
        for (let j = 0; j < cols; j++) {
            gameboard[i].push(Cell());
        }
    }

    const getBoard = () => gameboard;

    const addMark = (row, column, player) => {
        // check if spot taken on the gameboard
        if (gameboard[row][column].getValue() !== "") {
            console.log("You can't mark here, it's taken.")
            return false;
        }

        // otherwise, I have a valid empty cell
        gameboard[row][column].addSymbol(player);
        return true;
    };

    const clearBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                gameboard[i][j].removeValue();
            }
        }
    }

    const printBoard = () => {
        const boardWithCellValues = gameboard.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };


    return {
        clearBoard,
        getBoard,
        printBoard,
        addMark
    };
})();

// Cell represents one square on the board
function Cell() {
    let value = "";

    // change value of the cell
    const addSymbol = (player) => {
        value = player;
    };

    // retrieve current cell value
    const getValue = () => value;

    const removeValue = () => {
        value = "";
    }

    return {
        getValue, addSymbol, removeValue
    };
}

// gameController module will be responsible for controlling the flow and state of the game 
function gameController() {
    const board = gameBoard;

    const form = document.getElementById("playButton");
    const container = document.getElementById("container");
    const introScreen = document.getElementById("intro-screen");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        players[0].name = document.getElementById("player1").value;
        players[1].name = document.getElementById("player2").value;

        console.log(activePlayer.name)
        activePlayer = players[0];

        display.updateScreen();
        display.clearBoard();

        introScreen.style.display = "none";
        container.style.display = "grid";
    })

    const players = [
        {
            name: "",
            symbol: "X"
        },
        {
            name: "",
            symbol: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        if (activePlayer === players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0];
        }
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn`)
    }

    function restartGame() {
        console.log("please work")
        activePlayer = players[0];
        return activePlayer;
    }

    // check for tie
    const draw = () => {
        const boardWithCellValues = board.getBoard().map((row) => row.map((cell) => cell.getValue()))
        // if any row contains "", then board is not filled yet, return false
        if (boardWithCellValues[0].includes("") || boardWithCellValues[1].includes("") || boardWithCellValues[2].includes("")) {
            return false;
        }
        return true;
    }

    const playRound = (row, column) => {

        // console.log(`Marking ${getActivePlayer().symbol} on row ${row} column ${column}`)
        const valid = board.addMark(row, column, getActivePlayer().symbol);

        // if not valid, then do not switch players and print new round
        if (!valid) {
            return;
        }

        // check for row win
        function checkRow() {
            for (let i = 0; i < board.getBoard().length; i++) {
                if (board.getBoard()[i][0].getValue() === getActivePlayer().symbol && board.getBoard()[i][1].getValue() === getActivePlayer().symbol && board.getBoard()[i][2].getValue() === getActivePlayer().symbol) {
                    return true;
                }
            }
            return false;
        }

        // check for column win
        function checkCol() {
            let currentCol = 0;
            let currentRow = 0;
            while (currentCol !== 3) {
                if (board.getBoard()[currentRow][currentCol].getValue() === getActivePlayer().symbol) {
                    currentRow++;
                    if (currentRow === 3) {
                        return true;
                    }
                }
                else {
                    currentRow = 0;
                    currentCol++;
                }
            }
            return false;
        }

        // check for diagonal win 
        function checkDiagonal() {
            if (board.getBoard()[1][1].getValue() === getActivePlayer().symbol) {
                if (board.getBoard()[0][0].getValue() === getActivePlayer().symbol && board.getBoard()[2][2].getValue() === getActivePlayer().symbol) {
                    return true;
                } else if (board.getBoard()[0][2].getValue() === getActivePlayer().symbol && board.getBoard()[2][0].getValue() === getActivePlayer().symbol) {
                    return true;
                }
            }
            return false;
        }

        if (checkRow() || checkCol() || checkDiagonal()) {
            // always start with X
            if (activePlayer === players[1]) {
            }
            return true;
        }

        switchPlayerTurn();
        printNewRound();
    };

    // Initial play game message
    printNewRound();

    return { getBoard: board.getBoard, playRound, getActivePlayer, draw, restartGame };
}

// displayController module responsible for management of the DOM
function displayController() {
    const restartBoard = gameBoard; // to call the clearBoard function, could use a better variable name
    const game = gameController();
    const boardDiv = document.querySelector(".board");
    const playerTurn = document.querySelector(".turn");
    const restart = document.querySelector("#restart");
    const backButton = document.querySelector("#back");

    const container = document.getElementById("container");
    const introScreen = document.getElementById("intro-screen");

    const updateScreen = () => {

        boardDiv.textContent = ""; // clear the board 

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // display player's turn
        playerTurn.textContent = `${activePlayer.name}'s turn`;

        // Change color of playerTurn div according to player color
        if (activePlayer.symbol === "X") {
            playerTurn.style.color = "var(--player-1-color)";
        } else if (activePlayer.symbol = "O") {
            playerTurn.style.color = "var(--player-2-color)";
        }

        // render board rows
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                // anything clickable should be a button
                const cellButton = document.createElement("button")
                cellButton.classList.add("Cell");
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = board[i][j].getValue();

                // assign cellButton's corresponding class to handle CSS coloring
                if (cellButton.textContent === "X") {
                    cellButton.classList.add("X");
                } else if (cellButton.textContent === "O") {
                    cellButton.classList.add("O");
                }
                boardDiv.appendChild(cellButton)
            }
        }
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) {
            return;
        }

        // if valid, play round
        let play = game.playRound(selectedRow, selectedColumn);
        updateScreen();

        if (play === true) {
            playerTurn.style.color = "var(--main-color)";
            playerTurn.textContent = `${game.getActivePlayer().name} wins!`
            boardDiv.removeEventListener("click", clickHandlerBoard);
            document.getElementById("restart").style.display = "block";
        } else if (game.draw() === true) {
            playerTurn.style.color = "var(--main-color)";
            playerTurn.textContent = "It's a draw!";
            boardDiv.removeEventListener("click", clickHandlerBoard);
            document.getElementById("restart").style.display = "block";
        }
    }

    function clearBoard(e) {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // clear board appearance 
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const cellButton = document.querySelector(".Cell");
                cellButton.textContent = "";
                boardDiv.appendChild(cellButton)
            }
        }
        const resetPlayerTurn = game.restartGame();
        restartBoard.clearBoard(); // clear board array values 
        document.getElementById("restart").style.display = "none";
        console.log(activePlayer.name)
        playerTurn.textContent = `${resetPlayerTurn.name}'s turn`;

        if (resetPlayerTurn.symbol === "X") {
            playerTurn.style.color = "var(--player-1-color)";
        } else {
            playerTurn.style.color = "var(--player-2-color)";
        }
        boardDiv.addEventListener("click", clickHandlerBoard) // allow clicking on board again after restart
    }

    function goBack(e) {
        container.style.display = "none";
        introScreen.style.display = "grid";
    }

    restart.addEventListener("click", clearBoard);
    backButton.addEventListener("click", goBack)
    boardDiv.addEventListener("click", clickHandlerBoard);

    // initial render
    updateScreen();

    return { playerTurn, updateScreen, clearBoard };
}

const display = displayController();
