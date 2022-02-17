/* Initialize the game board object as a module */

const gameBoard = (function(){

    let _board = ["", "", "", "", "", "", "", "", ""];

    function displayBoardContentToScreen() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            square.textContent = _board[i];
            square.id = i;
        }
    }

    function editBoardArray(playerSymbol, boardIndex) {
        _board[boardIndex] = playerSymbol;
    }
   

    return {board: _board, displayBoardContentToScreen, editBoardArray};

})();


/* Initialize the game state object as a module */

const gameState = (function(){

    let _turn = "user";

    function gameOver() {
        return !gameBoard.board.includes("");
    }

    function changeTurn() {
        _turn = _turn == "user" ? "computer" : "user";
        console.log(`Changed turn to ${_turn}`);
    }

    function getTurn() {
        return _turn;
    }

    return {changeTurn, getTurn, gameOver};


})();


/* Initialize the game controller object as module*/

const gameController = (function(){

    function enableUserClickSquares() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            if (gameBoard.board[i] == "") {
                square.addEventListener("click", placeUserMark);
                console.log(`Event listener added to square ${square.id}`);
            }
        }
    }

    function disableUserClickSquares() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            square.removeEventListener("click", placeUserMark);
            console.log(`Disabled click on square ${square.id}`);
        }
    }

    function placeUserMark(e) {
        const squareId = e.target.id;
        gameBoard.editBoardArray("X", squareId);
        disableUserClickSquares();

        console.log(`Placed mark at square ${squareId}`);
        console.log(`Here is the new board: ${gameBoard.board}`);

        // Check if game is over after every user and computer move
        gameState.changeTurn();
        gameBoard.displayBoardContentToScreen();

    }

    return {enableUserClickSquares};

})();


gameBoard.editBoardArray("X", 1);
gameBoard.displayBoardContentToScreen();
gameController.enableUserClickSquares();

