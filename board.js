export function createBoard(boardSize, numberOfMines) {
  var firstClick = true;
  //create counter
  let counter = document.createElement("p");
  counter.textContent = numberOfMines;
  document.body.appendChild(counter);
  //map for board
  const boardMap = [];
  //create board
  let board = document.createElement("div");
  board.className = "board";
  document.body.appendChild(board);
  //create tiles inside board
  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      //create tile object inside board element
      const element = document.createElement("div");
      element.className = "hidden";
      element.addEventListener("click", () => {
        if (firstClick == true) {
          generateMine(boardMap, boardSize, numberOfMines, tile);
          firstClick = false;
        }
        revealTiles(boardMap, numberOfMines, tile, counter);
      });
      element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        flagTiles(boardMap, numberOfMines, tile, counter);
      });
      const tile = {
        x: x,
        y: y,
        element: element,
        isMine: false,
        isRevealed: false,
      };
      board.appendChild(tile.element);
      row.push(tile);
    }
    boardMap.push(row);
  }
}

function generateMine(boardMap, boardSize, numberOfMines, tile) {
  var totalMineCount = 0;
  //generate unique mine positions
  for (let i = 0; i < numberOfMines; i++) {
    //random X
    const minePX = Math.round(Math.random() * (boardSize - 1));
    //random Y
    const minePY = Math.round(Math.random() * (boardSize - 1));
    if (tile.x != minePX || tile.y != minePY) {
      for (let i = 0; i < boardMap.length; i++) {
        boardMap[i].forEach((e) => {
          if (e.x == minePX && e.y == minePY) {
            e.isMine = true;
          }
        });
      }
    }
  }
  for (let i = 0; i < boardMap.length; i++) {
    boardMap[i].forEach((e) => {
      if (e.isMine == true) {
        totalMineCount++;
      }
    });
  }
  if (totalMineCount != numberOfMines) {
    repeatGenerateMine(boardMap, boardSize, numberOfMines, tile);
  }
}

function repeatGenerateMine(boardMap, boardSize, numberOfMines, tile) {
  var totalMineCount = 0;
  //generate unique mine positions
  //random X
  const minePX = Math.round(Math.random() * (boardSize - 1));
  //random Y
  const minePY = Math.round(Math.random() * (boardSize - 1));
  if (tile.x != minePX || tile.y != minePY) {
    for (let i = 0; i < boardMap.length; i++) {
      boardMap[i].forEach((e) => {
        if (e.x == minePX && e.y == minePY) {
          e.isMine = true;
        }
      });
    }
  }
  for (let i = 0; i < boardMap.length; i++) {
    boardMap[i].forEach((e) => {
      if (e.isMine == true) {
        totalMineCount++;
      }
    });
  }
  if (totalMineCount != numberOfMines) {
    repeatGenerateMine(boardMap, boardSize, numberOfMines, tile);
  }
}

function counterFunc(boardMap, numberOfMines, counter) {
  var numFlag = numberOfMines;
  for (let i = 0; i < boardMap.length; i++) {
    boardMap[i].forEach((e) => {
      if (e.element.className == "flag") {
        numFlag -= 1;
      }
    });
  }
  counter.textContent = numFlag;
}

function flagTiles(boardMap, numberOfMines, tile, counter) {
  //check if the tile is a valid target
  if (tile.element.className != "number") {
    if (tile.element.className == "flag") {
      tile.element.className = "hidden";
    } else {
      tile.element.className = "flag";
    }
  }
  counterFunc(boardMap, numberOfMines, counter);
}

function revealTiles(boardMap, numberOfMines, tile, counter) {
  if (tile.isMine == true) {
    revealAllMines(boardMap, counter);
  } else {
    revealNumberTiles(boardMap, numberOfMines, tile, counter);
  }
}

function revealAllMines(boardMap, counter) {
  for (let i = 0; i < boardMap.length; i++) {
    boardMap[i].forEach((e) => {
      if (e.isMine == true) {
        e.element.className = "mine";
      }
    });
  }
  //lost event
  counter.textContent = "You LOSE :(";
}

function revealNumberTiles(boardMap, numberOfMines, tile, counter) {
  var mineCount = 0,
    winCon = true;
  const allNearbyTiles = [];
  //get all surrounding tiles coord
  for (let xOffest = -1; xOffest <= 1; xOffest++) {
    for (let yOffest = -1; yOffest <= 1; yOffest++) {
      const nearbyTile = boardMap[tile.x + xOffest]?.[tile.y + yOffest];
      if (nearbyTile) {
        if (tile.isRevealed == false) {
          allNearbyTiles.push(nearbyTile);
        }
      }
    }
  }
  allNearbyTiles.forEach((e) => {
    if (e != undefined) {
      for (let i = 0; i < boardMap.length; i++) {
        boardMap[i].forEach((m) => {
          if (e.x == m.x && e.y == m.y) {
            if (m.isMine == true) {
              mineCount++;
            }
          }
        });
      }
    }
  });
  tile.element.className = "number";
  tile.isRevealed = true;
  //print out numbe rof mines inside the tile
  if (mineCount != 0) {
    tile.element.textContent = mineCount;
  } else {
    allNearbyTiles.forEach((e) => {
      revealNumberTiles(boardMap, numberOfMines, e, counter);
    });
  }
  counterFunc(boardMap, numberOfMines, counter);
  //check win condition
  for (let i = 0; i < boardMap.length; i++) {
    boardMap[i].forEach((e) => {
      if (e.isMine == false) {
        if (e.element.className == "hidden") {
          winCon = false;
        }
      }
    });
  }
  if (winCon == true) {
    //win event
    counter.textContent = "You WIN!";
  }
}
