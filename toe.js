document.addEventListener("DOMContentLoaded", () => {
  let boxes = document.querySelectorAll(".box");
  let reset = document.querySelector(".reset");
  let msgContainer = document.querySelector(".msgContainer");
  let newgame = document.querySelector("#newgame");
  let msg = document.querySelector(".msg");

  let turnO = true;
  const winpattern = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];

  function getAvailableMoves(board) {
    return board
      .map((val, i) => (val === "" ? i : null))
      .filter((i) => i !== null);
  }

  function checkWinnerAI(board) {
    for (let pattern of winpattern) {
      let [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }
    return board.includes("") ? null : "T"; // Tie condition
  }

  function minimax(board, depth, isMaximizing) {
    let result = checkWinnerAI(board);
    if (result === "X") return 10 - depth;
    if (result === "O") return depth - 10;
    if (result === "T") return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let symbol = isMaximizing ? "X" : "O";
    let moves = getAvailableMoves(board);

    for (let move of moves) {
      board[move] = symbol;
      let score = minimax([...board], depth + 1, !isMaximizing);
      board[move] = "";
      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
    return bestScore;
  }

  function getBestMove() {
    let board = Array.from(boxes).map((box) => box.innerText || "");
    let bestScore = -Infinity;
    let move = null;
    let moves = getAvailableMoves(board);

    for (let index of moves) {
      board[index] = "X";
      let score = minimax([...board], 0, false);
      board[index] = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
    return move;
  }

  function computerMove() {
    let move = getBestMove();
    if (move !== null) {
      boxes[move].innerText = "X";
      boxes[move].style.color = "#c3423f";
      boxes[move].disabled = true;
      checkWinner();
      turnO = true;
    }
  }

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      if (turnO && box.innerText === "") {
        box.innerText = "O";
        box.style.color = "#fde74c";
        box.disabled = true;
        turnO = false;
        checkWinner();
        if (!turnO) setTimeout(computerMove, 500);
      }
    });
  });

  function checkWinner() {
    for (let pattern of winpattern) {
      let [a, b, c] = pattern;
      if (
        boxes[a].innerText &&
        boxes[a].innerText === boxes[b].innerText &&
        boxes[b].innerText === boxes[c].innerText
      ) {
        showwinner(boxes[a].innerText);
        return;
      }
    }
    if ([...boxes].every((box) => box.innerText !== "")) {
      draw();
    }
  }

  function showwinner(winner) {
    msg.innerText = `Congratulations! ${winner} wins!`;
    msgContainer.classList.remove("hide");
    boxes.forEach((box) => (box.disabled = true));
  }

  function draw() {
    msg.innerText = "Game is a Tie!";
    msgContainer.classList.remove("hide");
    boxes.forEach((box) => (box.disabled = true));
  }

  function resetgame() {
    turnO = true;
    boxes.forEach((box) => {
      box.disabled = false;
      box.innerText = "";
    });
    msgContainer.classList.add("hide");
  }

  newgame.addEventListener("click", resetgame);
  reset.addEventListener("click", resetgame);
});
