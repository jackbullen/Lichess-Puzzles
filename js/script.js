const form = document.getElementById("usernameForm");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  fetchPuzzleData();
});
  
function fetchPuzzleData() {
  console.log(accessToken);
  const puzzleCountInput = document.getElementById("puzzleCount");
  const puzzleCount = puzzleCountInput.value;
  const params = new URLSearchParams();
  params.append("max", puzzleCount);
  fetch(`https://lichess.org/api/puzzle/activity?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then(response => response.text())
    .then(text => {
      const trimmedText = text.trim();
      console.log(trimmedText.split('\n'));
  
      const puzzles = trimmedText.split('\n').map(puzzleData => JSON.parse(puzzleData));
  
      const puzzlesContainer = document.getElementById("puzzlesContainer");
      puzzlesContainer.innerHTML = ``;
      puzzles.forEach((puzzle) => {
        const fen = puzzle.puzzle.fen;
        const puzzleId = puzzle.puzzle.id;
        const result = puzzle.win ? "win" : "loss";
        const rating = puzzle.rating;
        const themes = puzzle.themes;
        const lastMove = puzzle.lastMove;
        if (result == "loss"){
          createChessboard(puzzleId, fen, result);
        }
      });
    })
    .catch(error => {
      console.log("Error:", error);
    });
}

function createChessboard(puzzleId, fen, result) {
  
  const puzzlesContainer = document.getElementById("puzzlesContainer");
  

  const puzzleContainer = document.createElement("div");
  puzzleContainer.id = `puzzle-container`;

  const puzzleLink = document.createElement("a");
  puzzleLink.href = `https://lichess.org/training/${puzzleId}`; 
  puzzleLink.target = "_blank"; 
  puzzlesContainer.append(puzzleLink); 

  puzzleLink.append(puzzleContainer)

  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board-container");
  puzzleContainer.appendChild(boardContainer);

  const chessboard = document.createElement("div");
  chessboard.id = `board_${puzzleId}`;
  chessboard.classList.add("custom-chessboard");
  boardContainer.appendChild(chessboard);


  const boardResult = document.createElement("div");
  boardResult.classList.add("board-result");
  boardResult.innerText = `Puzzle ID: ${puzzleId}`;
  puzzleContainer.appendChild(boardResult);

  const fenParts = fen.split(" ");
  const fenSideToMove = fenParts[1];
  const orientation = fenSideToMove === "w" ? "white" : "black";

  const board = ChessBoard(`board_${puzzleId}`, {
    position: fen,
    orientation: orientation
  });
}



