var currentPlayer = 1; // Player 1 starts
var playerNames = [];
var gameBoard = []; // You can use a 2D array to represent the board state
var moves = 0
var isPawnClicked = 0
const numRows = 8;
const numCols = 8;

function initializeBoard() {
  gameBoard = []; 
  // Create the game board array with initial piece positions
  for (let row = 0; row < numRows; row++) {
    gameBoard[row] = [];
    for (let col = 0; col < numCols; col++) {
      if ((row + col) % 2 === 1) { // Add pieces only on dark squares
        if (row < 3) {
          gameBoard[row][col] = 1; // Player 1's piece
        } else if (row > 4) {
          gameBoard[row][col] = 2; // Player 2's piece
        } else {
          gameBoard[row][col] = 0; // Empty square
        }
      } else {
        gameBoard[row][col] = -1
      }}
  }
}

function pawnAddEventListener(pawn) {
  pawn.click(function() {
    if ($(this).hasClass(`pawn-p${currentPlayer}`)){
      if (isPawnClicked === 0) {
        console.log('clicked')
        
        const row = Math.floor($(this).parent().index() / numRows); // Calculate row index
        const col = $(this).parent().index() % numCols; // Calculate column index
        
        handleMove(row, col);
        isPawnClicked = 1
      }
      else if (isPawnClicked === 1) {
        $('.tile').removeClass('valid-move')
        isPawnClicked = 0
      }
    }
  });
}

function renderBoard() {
  board = $('.board')
  board.empty()

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let currentTile = gameBoard[row][col]
      
      let tileId = `r${row}c${col}`
      let tile = $(`#${tileId}`)
      let pawn = $('<div>').addClass('pawn');

      pawnAddEventListener(pawn)

      if (tile.length === 0) {
        tile = $('<div>').addClass('tile');
        tile.attr('id', `r${row}c${col}`)
      }
      
      switch (currentTile) {
        case 1:
        case 2:
          if (!tile.hasClass('black-tile')) {
            tile.addClass('black-tile');
          }
          pawn.addClass(`pawn-p${currentTile}`)
          tile.append(pawn);
          break;
        
        case 0:
          if (!tile.hasClass('black-tile')) {
            tile.addClass('black-tile');
          }
          break;

        case -1:
          if (!tile.hasClass('white-tile')) {
            tile.addClass('white-tile');
          }
          break;
      }
      tile.appendTo(board);
    }
  }
}

// Function to switch turns between players
function switchTurn() {
  currentPlayer = 3 - currentPlayer; // Toggle between 1 and 2
  $('.turn').text(`Current Turn: ${playerNames[currentPlayer - 1]}`);
  moves ++;
  $('.moves').text(`Number of Moves: ${moves}`);
  isPawnClicked = 0
}

// Function to handle a move
function handleMove(row, col) {
  const selectedPiece = gameBoard[row][col];

  if (selectedPiece === currentPlayer) {
    
    highlightValidMoves(row, col);
    
    // Add event listener for valid destination squares
    $('.valid-move').click(function(e) {
      e.preventDefault();
      const destRow = Math.floor($(this).index() / numRows);
      const destCol = $(this).index() % numCols;

      // Implement the movement logic
      // console.log(gameBoard);
      if (gameBoard[destRow][destCol] !== -1 ) {
        gameBoard[destRow][destCol] = selectedPiece;
        gameBoard[row][col] = 0; // Clear the source square
        $('.valid-move').removeClass('valid-move');
        switchTurn();
      }
      renderBoard();
    });
  }
}

// Function to highlight valid moves for a selected piece
function highlightValidMoves(row, col) {
  const selectedPiece = gameBoard[row][col];

  // Clear existing valid move highlights
  $('.valid-move').removeClass('valid-move');

  // Define possible move directions based on the player
  const moveDirections = (selectedPiece === 2) ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  // Check each move direction
  for (const direction of moveDirections) {
    const newRow = row + direction[0];
    const newCol = col + direction[1];

    // Check if the new position is within the bounds of the board
    if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
      const targetPiece = gameBoard[newRow][newCol];
      // Check if the target square is empty
      if (targetPiece === 0) {
        $(`#r${newRow}c${newCol}.tile`).addClass('valid-move');
      }
    }
  }
}

$(document).ready(function() {
  
  // Event listener for form submission
  $('#nameForm').submit(function(event) {
    event.preventDefault();
    playerNames.push($('#player1').val(), $('#player2').val());
    $('#nameForm').hide();
    initializeBoard();
    renderBoard();
    $('.turn').text(`Current Turn: ${playerNames[currentPlayer - 1]}`);
    $('.moves').text('Number of Moves: ' + moves)
  });

  // Add event listeners for each board square to handle moves
});