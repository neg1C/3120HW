import { createBoard } from "./board.js";

let name = document.createElement("p");
  name.textContent = "Hello, I am Wong Yik Hei.";

 var boardSize = 10, numberOfMines = boardSize;

 createBoard(boardSize, numberOfMines);

