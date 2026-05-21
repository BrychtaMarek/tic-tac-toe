function createPlayer(name, mark) {
  return { name, mark };
}

function createGameboard() {
  const fields = Array(9);
  fields.fill(undefined);

  const getField = function (index) {
    return fields[index];
  };

  let numberOfTurns = 0;

  const markField = function (index, mark) {
    if (getField(index)) {
      return false;
    } else {
      fields[index] = mark;
      numberOfTurns += 1;
      return true;
    }
  };

  const reset = function () {
    fields.fill(undefined);
    numberOfTurns = 0;
  };

  const isFull = () => {
    return numberOfTurns === fields.length;
  };

  return { getField, markField, isFull, reset };
}

function createGame() {
  const gameboard = createGameboard();

  const players = [
    createPlayer("Player X", "X"),
    createPlayer("Player O", "O"),
  ];

  const setPlayerName = function (index, name) {
    players[index].name = name;
  };

  let currentPlayer = players[0];

  const getCurrentPlayer = () => currentPlayer;

  const reset = function () {
    gameboard.reset();
    currentPlayer = players[0];
  };

  const changeTurn = function () {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  let latestMoveIndex = undefined;

  const handleMove = function (index) {
    if (gameboard.markField(index, currentPlayer.mark)) {
      latestMoveIndex = index;
      displayHandler.render();
      checkVictory();
      // Move this up if you want player X to always start
      changeTurn();
    }
  };

  const checkVictory = function () {
    let gameOver = false;
    let tie = false;

    // Get latest field and mark
    let lastMoveMark = gameboard.getField(latestMoveIndex);

    // Check horizontal
    let continuousCount = 0;
    for (let index = 0; index < 9; index++) {
      if (index % 3 === 0) {
        continuousCount = 0;
      }
      const element = gameboard.getField(index);
      if (element === lastMoveMark) {
        continuousCount++;
      }

      if (continuousCount === 3) {
        gameOver = true;
        break;
      }
    }

    // Check vertical
    continuousCount = 0;
    for (let index = 0; index < 3; index++) {
      const firstRowVal = gameboard.getField(index);
      const secondRowVal = gameboard.getField(index + 3);
      const thirdRowVal = gameboard.getField(index + 2 * 3);
      if (
        firstRowVal &&
        secondRowVal &&
        thirdRowVal &&
        firstRowVal === secondRowVal &&
        secondRowVal === thirdRowVal
      ) {
        gameOver = true;
        break;
      }
    }

    // Check diagonals

    // Check main diagonal
    let winMain = true;
    for (let i = 0; i < 3; i++) {
      if (gameboard.getField(i * (3 + 1)) !== lastMoveMark) {
        winMain = false;
        break;
      }
    }
    if (winMain) gameOver = true;

    // Check anti-diagonal
    let winAnti = true;
    for (let i = 1; i <= 3; i++) {
      if (gameboard.getField(i * (3 - 1)) !== lastMoveMark) {
        winAnti = false;
        break;
      }
    }
    if (winAnti) gameOver = true;

    // Check Tie
    if (gameboard.isFull()) {
      tie = true;
      gameOver = true;
    }

    let status;

    if (tie) {
      status = 2;
    } else if (gameOver) {
      status = 1;
    } else status = 0;

    let message = "";
    if (status === 1) {
      message = `Game over. Player ${currentPlayer.name} with mark ${currentPlayer.mark} won.`;
    } else if (status === 2) {
      message = "Tie";
    } else message = "";

    if (status) {
      reset();
      displayHandler.render();
    }
    displayHandler.showGameStatus(message);
  };

  const gameInterface = {
    handleMove,
    reset,
    setPlayerName,
  };

  const displayHandler = createDisplayHandler(gameboard, gameInterface);
  displayHandler.addListeners();

  return gameInterface;
}

function createDisplayHandler(gameboard, game) {
  const fields = document.querySelectorAll(".field");
  const board = document.querySelector(".board");
  const txtMessage = document.querySelector(".message");

  const addListeners = function () {
    // Add event listener to reset button
    const btnReset = document.querySelector(".reset");
    btnReset.addEventListener("click", () => {
      game.reset();
      render();
    });

    // Add event listener to change player names inputs
    const txtNames = document.querySelectorAll(".player-name");
    txtNames.forEach((input) => {
      input.addEventListener("change", (event) => {
        const index = event.target.id === "playerX" ? 0 : 1;
        game.setPlayerName(index, event.target.value);
      });
    });

    fields.forEach((element, index) => {
      element.addEventListener("click", (event) => {
        game.handleMove(Number(event.target.id));
      });
    });
  };

  const render = function () {
    // UPDATE FIELDS
    for (let index = 0; index < 9; index++) {
      const field = gameboard.getField(index);
      const element = document.getElementById(index);
      element.textContent = field ? field : "";
    }
  };

  const showGameStatus = function (message) {
    txtMessage.textContent = message;
  };

  return { render, addListeners, showGameStatus };
}

const game = createGame();
