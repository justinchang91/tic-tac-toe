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
            const result = gameState.getGameResults();
            if (result === "tie") {
                console.log("Game over. Tie!");
            } else {
                console.log(`Game over. ${result} won!`);
            }
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
            const result = gameState.getGameResults();
            if (result === "tie") {
                console.log("Game over. Tie!");
            } else {
                console.log(`Game over. ${result} won!`);
            }
        } else {
            gameState.changeTurn();
            enableClickSquares();
        }
        
    }

    return {enableClickSquares};

})();


/* Controls the settings form */

const settingsController = (function() {
    function enablePVPElements() {
        disableAIElements();
        const playerOptions = document.querySelectorAll(".player");
        playerOptions.forEach(player => {
            player.classList.add("active");
            const textboxes = player.querySelector('input[type="text"]');
            textboxes.disabled = false;
            const marks = player.querySelector(".marks");
            marks.classList.add("active");
            const radioButtons = marks.querySelectorAll('input[type=radio]');
            radioButtons.forEach(radio => radio.disabled = false);
        });
    }
    
    function disablePVPElements() {
        const playerOptions = document.querySelectorAll(".player");
        playerOptions.forEach(player => {
            player.classList.remove("active");
            const textboxes = player.querySelector('input[type="text"]');
            textboxes.disabled = true;
            const marks = player.querySelector(".marks");
            marks.classList.remove("active");
            const radioButtons = marks.querySelectorAll('input[type=radio]');
            radioButtons.forEach(radio => radio.disabled = true);
        });
    }
    
    function enableAIElements(){
        disablePVPElements();
        const aiOption = document.querySelector(".computer");
        aiOption.classList.add("active");
        const difficulty = document.querySelector(".difficulty");
        difficulty.classList.add("active");
        const radioButtons = difficulty.querySelectorAll('input[type=radio]');
        radioButtons.forEach(radio => radio.disabled = false);
    
        const player1 = document.querySelector(".player1");
        player1.classList.add("active");
        const textboxes = player1.querySelector('input[type="text"]');
        textboxes.disabled = false;
        const marks = player1.querySelector(".marks");
        marks.classList.add("active");
        const p1RadioButtons = marks.querySelectorAll('input[type=radio]');
        p1RadioButtons.forEach(radio => radio.disabled = false);
    }
    
    function disableAIElements() {
        const aiOption = document.querySelector(".computer");
        aiOption.classList.remove("active");
        const difficulty = document.querySelector(".difficulty");
        difficulty.classList.remove("active");
        const aiRadioButtons = difficulty.querySelectorAll('input[type=radio]');
        aiRadioButtons.forEach(radio => radio.disabled = true);
    
        const player1 = document.querySelector(".player1");
        player1.classList.remove("active");
        const textboxes = player1.querySelector('input[type="text"]');
        textboxes.disabled = true;
        const marks = player1.querySelector(".marks");
        marks.classList.remove("active");
        const p1RadioButtons = marks.querySelectorAll('input[type=radio]');
        p1RadioButtons.forEach(radio => radio.disabled = true);
    }

    function processFormData(ev) {
        ev.preventDefault()  // stop the form from submitting

        let gameSettings = {}

        // Check which mode we're in
        const mode = document.querySelector('.mode');
        if (mode.querySelector('input[id="pvp"]').checked === true) {
            gameSettings.mode = "pvp";
        } else if (mode.querySelector('input[id="ai"]').checked === true) {
            gameSettings.mode = "ai";
        } else {  // User didn't select anything
            console.log("Error! User didn't select a mode"); // temporary
            return;
        }

        // Get the player 1 info
        gameSettings.player1 = {};
        const player1 = document.querySelector('.player1');
        getPlayerInfo(player1, "player1", gameSettings);
        
        if (gameSettings.mode === "pvp") {
            // get player 2 info
            gameSettings.player2 = {};
            const player2 = document.querySelector('.player2');
            getPlayerInfo(player2, "player2", gameSettings);
        } else {
            // Get computer info
            gameSettings.computer = {};
            const computer = document.querySelector('.computer');
            getComputerInfo(computer, gameSettings);
        }

        //return gameSettings;
        console.log(gameSettings);
    }

    function getPlayerInfo(player, playerNum, gameSettings) {
        // Get player name:
        const name = player.querySelector('input[type=text]').value;
        if (name === "") {
            console.log("Please enter a name for player 1!");
            return;
        } else {
            gameSettings[playerNum].name = name;
        }

        // Get player mark
        const mark = player.querySelector('.marks');
        if (mark.querySelector('input[id="x"]').checked === true) {
            gameSettings[playerNum].mark = "X";
        } else if (mark.querySelector('input[id="o"]').checked === true) {
            gameSettings[playerNum].mark = "O";
        } else {  // User didn't select anything
            console.log("Error! User didn't select a mode"); // temporary
            return;
        }
    }

    function getComputerInfo(computer, gameSettings) {
        // Get computer difficulty
        const compDifficulty = computer.querySelector('.difficulty');
        if (compDifficulty.querySelector('input[id="easy"]').checked === true) {
            gameSettings.computer.difficulty = "easy";
        } else if (compDifficulty.querySelector('input[id="hard"]').checked === true) {
            gameSettings.computer.difficulty = "hard";
        } else {  // User didn't select anything
            console.log("Error! User didn't select a mode"); // temporary
            return;
        }

        // Get computer mark
        const p1Mark = gameSettings.player1.mark;
        gameSettings.computer.mark = p1Mark === "X" ? "O" : "X";
    }

    return {enablePVPElements, enableAIElements, processFormData}
})();

const pvpButton = document.querySelector('input[id="pvp"]');
pvpButton.addEventListener("click", settingsController.enablePVPElements);

const aiButton = document.querySelector('input[id="ai"]');
aiButton.addEventListener("click", settingsController.enableAIElements);

const playButton = document.querySelector(".submit-button");
playButton.addEventListener("click", settingsController.processFormData);






gameBoard.displayBoardContentToScreen();
gameController.enableClickSquares();

