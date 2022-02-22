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

    let turn = "";
    let gameSettings = {};

    function gameOver(mark) {
        return checkWinner(mark) || !gameBoard.board.includes("");
    }

    function changeTurn() {
        let message = undefined;
        if (gameState.turn === gameState.gameSettings.X) {
            gameState.turn = gameState.gameSettings.O;
            message = Message("O", null).outputTurn();
        } else {
            gameState.turn = gameState.gameSettings.X;
            message = Message("X", null).outputTurn();
        }
        gameLogController.addToMessagesArray(message);
        gameLogController.displayMessages();
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

    return {changeTurn, gameOver, getGameResults, gameSettings, turn};


})();


/* Initialize the game controller object as module*/

const gameController = (function(){

    function enableClickSquares() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            if (gameBoard.board[i] == "") {

                if (gameState.turn === gameState.gameSettings.X) {
                    square.addEventListener("click", placeXMark);
                    console.log(`User event listener added to square ${square.id}`);
                } else {
                    square.addEventListener("click", placeOMark);
                    console.log(`Computer event listener added to square ${square.id}`);
                }
            }
        }
    }

    function disableClickSquares() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            if (gameState.turn === gameState.gameSettings.X) {
                square.removeEventListener("click", placeXMark);
                console.log(`Disabled user click on square ${square.id}`);
            } else {
                square.removeEventListener("click", placeOMark);
                console.log(`Disabled computer click on square ${square.id}`);
            }
        }
    }

    function placeXMark(e) {
        const squareId = e.target.id;
        gameBoard.editBoardArray("X", squareId);
        disableClickSquares();

        console.log(`${gameState.gameSettings.X} placed mark at square ${squareId}`);
        console.log(`Here is the new board: ${gameBoard.board}`);

        gameBoard.displayBoardContentToScreen();

        const message = Message("X", squareId).outputMove();
        gameLogController.addToMessagesArray(message);
        gameLogController.displayMessages();
        

        // Check if game is over after every user and computer move
        if (gameState.gameOver("X")) {
            let message = undefined;
            const result = gameState.getGameResults();

            if (result === "tie") {
                message = Message("X", squareId).outputTie();
            } else {
                message = Message("X", squareId).outputWinner();
            }

            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();

        } else {
            gameState.changeTurn();
            enableClickSquares();
        }
    }

    function placeOMark(e) {
        const squareId = e.target.id;
        gameBoard.editBoardArray("O", squareId);
        disableClickSquares();


        console.log(`${gameState.gameSettings.O} placed mark at square ${squareId}`);
        console.log(`Here is the new board: ${gameBoard.board}`);

        gameBoard.displayBoardContentToScreen();

        const message = Message("O", squareId).outputMove();
        gameLogController.addToMessagesArray(message);
        gameLogController.displayMessages();

        // Check if game is over after every user and computer move
        if (gameState.gameOver("O")){
            let message = undefined;
            const result = gameState.getGameResults();

            if (result === "tie") {
                message = Message("O", squareId).outputTie();
            } else {
                message = Message("O", squareId).outputWinner();
            }

            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();

        } else {
            gameState.changeTurn();
            enableClickSquares();
        }
    }

    function gameSetup() {
        const pvpButton = document.querySelector('input[id="pvp"]');
        pvpButton.addEventListener("click", settingsController.enablePVPElements);

        const aiButton = document.querySelector('input[id="ai"]');
        aiButton.addEventListener("click", settingsController.enableAIElements);

        const playButton = document.querySelector(".submit");
        playButton.addEventListener("click", settingsController.processFormData);

        const introMessage = Message(null, null).outputIntroMessage();
        gameLogController.addToMessagesArray(introMessage);
        gameLogController.displayMessages();
    }

    function gameStart() {
        gameBoard.displayBoardContentToScreen();
        console.log(gameState.gameSettings.X);
        gameState.turn = gameState.gameSettings.X; // Set turn to X for default

        const message = Message("X", null).outputTurn();
        gameLogController.addToMessagesArray(message);
        gameLogController.displayMessages();
        enableClickSquares();

        // Make a function that creates the player objects. Call the function here?
        // Maybe when we add to the gameSettings object, we create the actual players
        // using a factory function then add that to the gameSettings object.
    }

    return {gameSetup, gameStart};

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

    function disableModeElements() {
        const mode = document.querySelector(".mode");
        mode.classList.add("hide");
        const modeRadioButtons = mode.querySelectorAll('input[type=radio]');
        modeRadioButtons.forEach(radio => radio.disabled = true);
    }

    function enableModeElements() {
        const mode = document.querySelector(".mode");
        mode.classList.remove("hide");
        const modeRadioButtons = mode.querySelectorAll('input[type=radio]');
        modeRadioButtons.forEach(radio => radio.disabled = false);
    }

    function gameStartSettings() {
        disablePVPElements();
        disableAIElements();
        disableModeElements();
        document.querySelector(".restart").classList.add("active");
        document.querySelector(".submit").classList.add("hide");
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
            let message = Message(null, null).outputErrorNoMode();
            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();
            return;
        }

        // Get the player 1 info
        const player1 = document.querySelector('.player1');
        if (!getPlayerInfo(player1, gameSettings)) return;
        
        if (gameSettings.mode === "pvp") {
            // get player 2 info
            const player2 = document.querySelector('.player2');
            if (!getPlayerInfo(player2, gameSettings)) return;
        } else {
            // Get computer info
            gameSettings.computer = {};
            const computer = document.querySelector('.computer');
            if(!getComputerInfo(computer, gameSettings)) return;
        }

        
        gameStartSettings();
        console.log(gameSettings);
        gameState.gameSettings = gameSettings;
        gameController.gameStart();
    }

    function resetSettings() {
       document.forms[0].reset(); // reset the form
    }

    function getPlayerInfo(player, gameSettings) {
        // Get player name:
        const name = player.querySelector('input[type=text]').value;
        if (name.length === 0) {
            let message = Message(null, null).outputErrorNoName();
            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();
            return false;
        } 

        // Get player mark, assign name to mark
        const mark = player.querySelector('.marks');
        if (mark.querySelector('input[id="x"]').checked === true) {
            if (gameSettings.hasOwnProperty("X")) {  // If X is already chosen
                let message = Message("X", null).outputErrorMarkAlreadyChosen();
                gameLogController.addToMessagesArray(message);
                gameLogController.displayMessages();
                return false;
            } else {
                gameSettings["X"] = name;
            }
        } else if (mark.querySelector('input[id="o"]').checked === true) {
            if (gameSettings.hasOwnProperty("O")) {  // If O is already chosen
                let message = Message("O", null).outputErrorMarkAlreadyChosen();
                gameLogController.addToMessagesArray(message);
                gameLogController.displayMessages();
                return false;
            } else {
                gameSettings["O"] = name;
            }
        } else {  // User didn't select anything
            let message = Message(null, null).outputErrorNoMark();
            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();
            return false;
        }

        return true;
    }

    function getComputerInfo(computer, gameSettings) {
        // Get computer difficulty
        const compDifficulty = computer.querySelector('.difficulty');
        if (compDifficulty.querySelector('input[id="easy"]').checked === true) {
            gameSettings.computer.difficulty = "easy";
        } else if (compDifficulty.querySelector('input[id="hard"]').checked === true) {
            gameSettings.computer.difficulty = "hard";
        } else {  // User didn't select anything
            let message = Message(null, null).outputErrorNoDifficulty();
            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();
            return false;
        }

        // Get computer mark (THIS IS WRONG. Change when editing computer)
        const p1Mark = gameSettings.player1.mark;
        gameSettings.computer.mark = p1Mark === "X" ? "O" : "X";

        return true;
    }

    return {enablePVPElements, enableAIElements, processFormData, resetSettings}
})();


/* Module that controls what gets displayed on the game log */

const gameLogController = (function() {
    let messages = [];

    function displayMessages() {
        const messageArea = document.querySelector(".message-area");
        removeAllChildNodes(messageArea);
        for (let message of messages) {
            const newMessage = document.createElement("div");
            newMessage.innerHTML = message;
            newMessage.classList.add("message");
            messageArea.appendChild(newMessage);
        }
    }

    function addToMessagesArray(message) {
        messages.unshift(message);
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
          parent.removeChild(parent.firstChild);
        }
    }

    return {messages, addToMessagesArray, displayMessages};
})();

/* Factory function that creates Message objects */

const Message = function(mark, location) {
    const name = gameState.gameSettings[mark];

    function outputIntroMessage() {
        return "Welcome to Tic Tac Toe!";
    }

    function outputTurn() {
        if (mark === "X") {
            return `It's <span style="color:blue">${name}</span>'s turn`;
        } else {
            return `It's <span style="color:red">${name}</span>'s turn`;
        }
        
    }

    function outputMove() {
        if (mark === "X") {
            return `<span style="color:blue">${name}</span> placed an ${mark} at P${location}`;
        } else {
            return `<span style="color:red">${name}</span> placed an ${mark} at P${location}`
        }
        
    }

    function outputWinner() {
        if (mark === "X") {
            return `Game over! <span style="color:blue">${name}</span> won!`;
        } else {
            return `Game over! <span style="color:red">${name}</span> won!`;
        }
        
    }

    function outputTie() {
        return `Game over! Tie!`;
    }

    function outputErrorNoMode() {
        return `<span style="color:red">Error! Please select a mode.</span>`;
    }

    function outputErrorNoMark() {
        return `<span style="color:red">Error! Please select a mark.</span>`;
    }

    function outputErrorNoDifficulty() {
        return `<span style="color:red">Error! Please select a difficulty.</span>`;
    }

    function outputErrorNoName() {
        return `<span style="color:red">Error! Please enter all required player names.</span>`;
    }

    function outputErrorMarkAlreadyChosen() {
        return `<span style="color:red">Error! Mark ${mark} was already chosen!`;
    }

    return {outputIntroMessage, outputTurn, outputMove, outputWinner, outputTie,
            outputErrorNoMode, outputErrorNoMark, outputErrorNoDifficulty,
            outputErrorNoName, outputErrorMarkAlreadyChosen};
};

gameController.gameSetup();

