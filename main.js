/* Initialize the game board object as a module */

const gameBoard = (function(){

    let _board = ["", "", "", "", "", "", "", "", ""];

    function displayBoardContentToScreen() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            square.textContent = _board[i];
        }
    }

    function editBoardArray(playerSymbol, boardIndex) {
        _board[boardIndex] = playerSymbol;
    }

    function getBoardArray() {
        return _board;
    }
    
    return {displayBoardContentToScreen, editBoardArray, getBoardArray};

})();


/* Initialize the game state object as a module */

const gameState = (function(){

    let _turn = "user";

    function gameOver() {
        return !gameBoard.getBoardArray().includes(""); 
    }

    function changeTurn() {
        _turn = _turn == "user" ? "computer" : "user";
    }

    function getTurn() {
        return _turn;
    }

    return {gameOver, changeTurn, getTurn};


})();

gameBoard.editBoardArray("X", 1);
gameBoard.displayBoardContentToScreen();
console.log(gameState.gameOver());