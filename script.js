// gameboard module because we only need one of it
const gameBoard = (function () {
    // store gameboard as an array 
    const gameboard = [];
    const rows = 3;
    const cols = 3;

    // fill game board with arrays that contain an object that is an empty cell 
    for (let i = 0; i < rows; i++) {
        gameboard.push([]);
        for (let j = 0; j < cols; j++) {
            gameboard[i].push(Cell());
        }
    }
    return {
        gameboard
    };
})();

// Create empty cells 
function Cell() {
    let cell = "";
    return cell;
}

// displayController module because we only need one of it
const displayController = (function () {
    // control game display
});

// factory function for players because we need multiple (X, O)
function players() {
    return {};
}

// function that will render the contents of the gameboard array to the webpage
const render = (function () {
    const board = gameBoard.gameboard;
    const container = document.getElementById("container");

    container.textContent = "";

    for (let i = 0; i < board.length; i++) {
        let row = document.createElement('div');
        for (let j = 0; j < board[i].length; j++) {
            row.textContent += board[i][j];
        }
        container.appendChild(row);
    }

})();