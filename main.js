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
    let winningSquares = [];

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
        if (gameBoard.board[0] === mark && gameBoard.board[1] === mark && gameBoard.board[2] === mark) {
            winningSquares.push(0, 1, 2);
            return true;
        } else if (gameBoard.board[3] === mark && gameBoard.board[4] === mark && gameBoard.board[5] === mark) {
            winningSquares.push(3, 4, 5);
            return true;
        } else if (gameBoard.board[6] === mark && gameBoard.board[7] === mark && gameBoard.board[8] === mark) {
            winningSquares.push(6, 7, 8);
            return true;
        } else if (gameBoard.board[0] === mark && gameBoard.board[3] === mark && gameBoard.board[6] === mark) {
            winningSquares.push(0, 3, 6);
            return true;
        } else if (gameBoard.board[1] === mark && gameBoard.board[4] === mark && gameBoard.board[7] === mark) {
            winningSquares.push(1, 4, 7);
            return true;
        } else if (gameBoard.board[2] === mark && gameBoard.board[5] === mark && gameBoard.board[8] === mark) {
            winningSquares.push(2, 5, 8);
            return true;
        } else if (gameBoard.board[0] === mark && gameBoard.board[4] === mark && gameBoard.board[8] === mark) {
            winningSquares.push(0, 4, 8);
            return true;
        } else if (gameBoard.board[2] === mark && gameBoard.board[4] === mark && gameBoard.board[6] === mark) {
            winningSquares.push(2, 4, 6);
            return true;
        } else {
            return false;
        }
    }

    function getGameResults() {
        return winningSquares;
    }

    return {changeTurn, gameOver, getGameResults, gameSettings, turn};


})();


/* Initialize the game controller object as module*/

const gameController = (function(){

    function gameStart() {
        gameBoard.displayBoardContentToScreen();
        console.log(gameState.gameSettings.X);
        gameState.turn = gameState.gameSettings.X; // Set turn to X at game start by default

        const message = Message("X", null).outputTurn();
        gameLogController.addToMessagesArray(message);
        gameLogController.displayMessages();

        determineTurnBasedOnMode();
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

    function determineTurnBasedOnMode() {
        // Check which mode we're in and determines whether or not it's the computer making a move or a player
        if (gameState.gameSettings.mode === "pvp") { 
            playerController.enableClickSquares();
        } else {
            // We are in AI game mode
            if (gameState.turn === "Computer" && gameState.gameSettings.difficulty === "easy") {
                computerController.makeComputerMoveEasy();
            } else if (gameState.turn === "Computer" && gameState.gameSettings.difficulty === "hard") {
                computerController.makeComputerMoveHard();
            } else {
                // It's the user's turn
                playerController.enableClickSquares();
            }
        }
    }

    function checkIfGameOver(mark, squareId) {
        if (gameState.gameOver(mark)) {
            let message = undefined;
            const winningSquares = gameState.getGameResults(); // Get the winning squares

            if (winningSquares.length === 0) {
                message = Message(mark, squareId).outputTie();
                // Colour all the squares red to show tie
                for (let i = 0; i < 9; i++) {
                    document.querySelector(`.square${i}`).style.backgroundColor = "crimson";
                }
            } else {
                message = Message(mark, squareId).outputWinner();
                // Color the winning squares green
                winningSquares.forEach(squareId => {
                    document.querySelector(`.square${squareId}`).style.backgroundColor = "palegreen";
                });
            }

            // Add the game over message to log
            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();

        } else {
            gameState.changeTurn();
            determineTurnBasedOnMode();
        }
    }

    return {gameSetup, gameStart, checkIfGameOver};

})();

/* Controls the player's moves */

const playerController = (function() {

    function enableClickSquares() {
        for (let i = 0; i < 9; i++) {
            const square = document.querySelector(`.square${i}`);
            if (gameBoard.board[i] == "") {

                if (gameState.turn === gameState.gameSettings.X) {
                    // If it's X's turn, place X in square when square is clicked
                    square.addEventListener("click", placeXMark);
                    console.log(`User event listener added to square ${square.id}`);
                } else {
                    // If it's O's turn, place O in square when square is clicked
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

        // Output message to log saying who moved
        const message = Message("X", squareId).outputMove();
        gameLogController.addToMessagesArray(message);
        gameLogController.displayMessages();
        

        // Check if game is over after every user and computer move
        gameController.checkIfGameOver("X", squareId);
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
        gameController.checkIfGameOver("O", squareId);
    }

    return {enableClickSquares, placeXMark, placeOMark};

})();

/* Controls the computer's moves */

const computerController = (function() {

    function getAvailableSquares() { // Returns an array of available squares
        let availableSquares = [];
        for (let i = 0; i < gameBoard.board.length; i++) {  // i represents square id
            if (gameBoard.board[i] === "") {
                availableSquares.push(i);
            }
        }
        return availableSquares;
    }

    function makeComputerMoveEasy() {
        // Randomly choose from the available squares and place there
        const availableSquares = getAvailableSquares();
        console.log("Here are the available squares: ");
        console.log(availableSquares);

        // Select a random square from the available squares list
        const computerChoice = availableSquares[Math.floor(Math.random() * availableSquares.length)];
        console.log(`Computer choice: ${computerChoice}`);

        // Make the computer place it's mark
        let compSymbol = undefined;
        if (gameState.gameSettings.X === "Computer") {
            compSymbol = "X";
        } else {
            compSymbol = "O";
        }

        // Set a timeout so that there is a slight delay before computer makes move
        setTimeout(() => {
            gameBoard.editBoardArray(compSymbol, computerChoice);
            gameBoard.displayBoardContentToScreen();

            const message = Message(compSymbol, computerChoice).outputMove();
            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();

            // Check if game is over after every user and computer move
            gameController.checkIfGameOver(compSymbol, computerChoice);
        }, 1500);   
    }

    function makeComputerMoveHard() {

    }

    return {makeComputerMoveEasy, makeComputerMoveHard};

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
            const computer = document.querySelector('.computer');
            if(!getComputerInfo(computer, gameSettings)) return;
        }

        
        gameStartSettings(); // Disable all the settings once the game has started
        console.log(gameSettings);
        gameState.gameSettings = gameSettings;
        gameController.gameStart(); // Check if it's PVP vs AI, go accordingly
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
            gameSettings.difficulty = "easy";
        } else if (compDifficulty.querySelector('input[id="hard"]').checked === true) {
            gameSettings.difficulty = "hard";
            // For now since I don't have hard mode set up
            let message = Message(null, null).outputErrorAIHardUnavailable();
            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();
            return false;
        } else {  // User didn't select anything
            let message = Message(null, null).outputErrorNoDifficulty();
            gameLogController.addToMessagesArray(message);
            gameLogController.displayMessages();
            return false;
        }

        // Get computer mark
        if (gameSettings.hasOwnProperty("X")) {
            gameSettings["O"] = "Computer";
        } else {
            gameSettings["X"] = "Computer";
        }

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
            return `<strong>Game over!</strong> <span style="color:blue">${name}</span> won!`;
        } else {
            return `<strong>Game over!</strong> <span style="color:red">${name}</span> won!`;
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
        return `<span style="color:red">Error! Mark ${mark} was already chosen!</span>`;
    }

    function outputErrorAIHardUnavailable() {
        return `<span style="color:red">Error! AI hard more is currently unavailable.</span>`;
    }

    return {outputIntroMessage, outputTurn, outputMove, outputWinner, outputTie,
            outputErrorNoMode, outputErrorNoMark, outputErrorNoDifficulty,
            outputErrorNoName, outputErrorMarkAlreadyChosen, outputErrorAIHardUnavailable};
};

gameController.gameSetup();

