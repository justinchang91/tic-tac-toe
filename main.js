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

    function gameOver(mark) {
        return checkWinner(mark) || !gameBoard.board.includes("");
    }

    function changeTurn() {
        _turn = _turn == "user" ? "computer" : "user";
        console.log(`Changed turn to ${_turn}`);
    }

    function getTurn() {
        return _turn;
    }

    function checkWinner(mark) {
        if ((gameBoard.board[0] === mark && gameBoard.board[1] === mark && gameBoard.board[2] === mark) ||
            (gameBoard.board[3] === mark && gameBoard.board[4] === mark && gameBoard.board[5] === mark) ||
            (gameBoard.board[6] === mark && gameBoard.board[7] === mark && gameBoard.board[8] === mark) ||
            (gameBoard.board[0] === mark && gameBoard.board[3] === mark && gameBoard.board[6] === mark) ||
            (gameBoard.board[1] === mark && gameBoard.board[4] === mark && gameBoard.board[7] === mark) ||
            (gameBoard.board[2] === mark && gameBoard.board[5] === mark && gameBoard.board[8] === mark) ||
            (gameBoard.board[0] === mark && gameBoard.board[4] === mark && gameBoard.board[8] === mark) ||
            (gameBoard.board[2] === mark && gameBoard.board[4] === mark && gameBoard.board[6] === mark)) {
                return true;
        } else {
            return false;
        }
    }

    function getGameResults() {
        if (checkWinner("X")) {
            return "user";  // These are hard coded but should change once I make player objects
        } else if (checkWinner("O")) {
            return "computer";
        } else {
            return "tie";
        }
    }

    return {changeTurn, getTurn, gameOver, getGameResults};


})();


/* Initialize the game controller object as module*/

const gameController = (function(){

    function enableClickSquares() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            if (gameBoard.board[i] == "") {

                if (gameState.getTurn() === "user") {
                    square.addEventListener("click", placeUserMark);
                    console.log(`User event listener added to square ${square.id}`);
                } else {
                    square.addEventListener("click", placeComputerMark);
                    console.log(`Computer event listener added to square ${square.id}`);
                }
            }
        }
    }

    function disableClickSquares() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            if (gameState.getTurn() === "user") {
                square.removeEventListener("click", placeUserMark);
                console.log(`Disabled user click on square ${square.id}`);
            } else {
                square.removeEventListener("click", placeComputerMark);
                console.log(`Disabled computer click on square ${square.id}`);
            }
        }
    }

    function placeUserMark(e) {
        const squareId = e.target.id;
        gameBoard.editBoardArray("X", squareId);
        disableClickSquares();

        console.log(`Placed mark at square ${squareId}`);
        console.log(`Here is the new board: ${gameBoard.board}`);

        gameBoard.displayBoardContentToScreen();

        // Check if game is over after every user and computer move
        if (gameState.gameOver("X")) {
            console.log("Game over. User (X) won!");
        } else {
            gameState.changeTurn();
            enableClickSquares();
        }
    }

    function placeComputerMark(e) {
        const squareId = e.target.id;
        gameBoard.editBoardArray("O", squareId);
        disableClickSquares();


        console.log(`Placed mark at square ${squareId}`);
        console.log(`Here is the new board: ${gameBoard.board}`);

        gameBoard.displayBoardContentToScreen();

        // Check if game is over after every user and computer move
        if (gameState.gameOver("O")){
            console.log("Game over. Computer (O) won!");
        } else {
            gameState.changeTurn();
            enableClickSquares();
        }
        
    }

    return {enableClickSquares};

})();

gameBoard.displayBoardContentToScreen();
gameController.enableClickSquares();

