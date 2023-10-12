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
            return;
        }

        // otherwise, I have a valid empty cell
        gameboard[row][column].addSymbol(player);
    };

    // will be deleted after we tie it to the DOM
    const printBoard = () => {
        // finish this function 
        const boardWithCellValues = gameboard.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {
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

    return {
        getValue, addSymbol
    };
}

// gameController module will be responsible for controlling the flow and state of the game 
function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    // implement this then displayController after
    const board = gameBoard;

    const players = [
        {
            name: playerOneName,
            symbol: "X"
        },
        {
            name: playerTwoName,
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
        console.log(`${activePlayer.symbol}'s turn`)
    }

    const playRound = (row, column) => {
        console.log(`Marking ${getActivePlayer().symbol} on row ${row} column ${column}`)

        board.addMark(row, column, getActivePlayer().symbol);

        // check for winner and handle logic, such as a win message

        switchPlayerTurn();
        printNewRound();
    };

    // Initial play game message
    printNewRound();

    return { getBoard: board.getBoard, playRound, getActivePlayer };
}

// displayController module responsible for management of the DOM
function displayController() {
    const game = gameController();
    const boardDiv = document.querySelector(".board");
    const playerTurn = document.querySelector(".turn");

    const updateScreen = () => {

        boardDiv.textContent = ""; // clear the board 

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // display player's turn
        playerTurn.textContent = `${activePlayer.symbol}'s turn!`;

        // render board rows
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                // anything clickable should be a button
                const cellButton = document.createElement("button")
                cellButton.classList.add("Cell");
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = board[i][j].getValue();
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
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // initial render
    updateScreen();
}

displayController();
