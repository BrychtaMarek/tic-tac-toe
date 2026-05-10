const size = 3;

const Gameboard = (function (size) {
  const fields = Array(size * size);
  const markField = function (position, mark) {
    if (fields[position]) {
      return console.log("Already assigned");
    } else {
      fields[position] = mark;
      lastMove = position;
      numberOfMarks++;
      return true;
    }
  };

  const getField = function (position) {
    return fields[position];
  };

  const reset = function () {
    fields.fill(undefined);
    numberOfMarks = 0;
  };

  let lastMove;
  const getLastMove = () => {
    return lastMove;
  };

  let numberOfMarks = 0;
  const isFull = () => {
    return numberOfMarks === fields.length;
  };

  return { markField, getField, reset, getLastMove, isFull };
})(size);

function createPlayer(name, mark, Gameboard, game) {
  const play = function (position) {
    if (Gameboard.markField(position, this.mark)) {
      game.changeTurn();
    }
  };

  return { name, mark, play };
}

function createGame(gameboard) {
  const victoryCondition = size;
  let playerTurn = "x";
  const getPlayerTurn = () => {
    return playerTurn;
  };
  function changeTurn() {
    checkGameState();
    if (playerTurn === "x") {
      playerTurn = "o";
    } else {
      playerTurn = "x";
    }
  }

  const checkGameState = function () {
    let gameOver = false;
    let tie = false;

    // Check horizontal
    let continuousCount = 0;
    for (let index = 0; index < size * size; index++) {
      if (index % size === 0) {
        continuousCount = 0;
      }
      const element = gameboard.getField(index);
      if (element === playerTurn) {
        continuousCount++;
      }

      if (continuousCount == victoryCondition) {
        gameOver = true;
        break;
      }
    }

    // Check vertical
    continuousCount = 0;
    for (let index = 0; index < size; index++) {
      const firstRowVal = gameboard.getField(index);
      const secondRowVal = gameboard.getField(index + size);
      const thirdRowVal = gameboard.getField(index + 2 * size);
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
    let lastMove = gameboard.getLastMove();
    let lastMoveMark = gameboard.getField(lastMove);
    // Check main diagonal
    let winMain = true;
    for (let i = 0; i < size; i++) {
      if (gameboard.getField(i * (size + 1)) !== lastMoveMark) {
        winMain = false;
        break;
      }
    }
    if (winMain) gameOver = true;

    // Check anti-diagonal
    let winAnti = true;
    for (let i = 1; i <= size; i++) {
      if (gameboard.getField(i * (size - 1)) !== lastMoveMark) {
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

    if (tie) {
      gameboard.reset();
      return 2;
    } else if (gameOver) {
      gameboard.reset();
      return 1;
    } else return 0;
  };

  return { getPlayerTurn, changeTurn, checkGameState };
}

function createDisplayHandler(gameboard, game) {
  const initialize = function () {
    const width = 500;
    const body = document.querySelector("body");

    // Create board
    const board = document.createElement("div");
    board.classList.add("board");
    board.style.width = width.toString() + "px";
    body.append(board);
    const fieldWidth = 500 / size;

    // Create fields
    for (let index = 0; index < size * size; index++) {
      const field = document.createElement("div");
      field.classList.add("field");
      field.id = index;
      field.style.width = fieldWidth.toString() + "px";
      field.style.height = fieldWidth.toString() + "px";
      field.style.backgroundColor = "grey";
      board.appendChild(field);
    }
  };

  function reset() {
    const fields = document.querySelectorAll(".field");
    fields.forEach((element, index) => {
      element.textContent = "";
    });
  }

  // Mark field on board and update gameboard state
  function play(event) {
    // check if the field is free
    const clickedField = parseInt(event.target.id);
    const isEmpty = gameboard.getField(clickedField) === undefined;

    if (isEmpty) {
      // get correct
      const mark = game.getPlayerTurn();

      // update gameboard object
      gameboard.markField(clickedField, mark);
      // change player
      game.changeTurn();
      // update displayed board
      event.target.textContent = mark;

      const gameState = game.checkGameState();
      if (gameState === 1) {
        alert(
          `Game over. Player with mark ${mark} won. Confirm to reset the game.`,
        );
        reset();
      } else if (gameState === 2) {
        alert("TIE!!!");
        reset();
      }
    }
  }

  const fillFields = function () {
    // Fill fields
    const fields = document.querySelectorAll(".field");
    fields.forEach((element, index) => {
      element.addEventListener("click", play);
      const value = gameboard.getField(index);
      element.textContent = value;
    });
  };

  const addMark = function (field, mark) {
    const fieldDiv = document.querySelector(`.field:nth-of-type(${field})`);
    fieldDiv.textContent = mark;
  };

  return { initialize, addMark, fillFields };
}

game = createGame(Gameboard);
displayHandler = createDisplayHandler(Gameboard, game);
displayHandler.initialize();
displayHandler.fillFields();
player1 = createPlayer("P1", "x", Gameboard, game);
player2 = createPlayer("P2", "o", Gameboard, game);
