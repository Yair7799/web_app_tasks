var currentPlayer = 1; // Player 1 starts
var playerNames = [];
var gameBoard = []; // You can use a 2D array to represent the board state
var moves = 0
var isPawnClicked = 0
var selectedPiece = {
  row: undefined,
  col: undefined,
  label: undefined
}
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
      $('.tile').off('click', '.valid-move, .eating-move')
      $('.valid-move').removeClass('valid-move');
      $('.eating-move').removeClass('eating-move');
      const row = Math.floor($(this).parent().index() / numRows); // Calculate row index
      const col = $(this).parent().index() % numCols; // Calculate column index
      
      selectedPiece.row = row
      selectedPiece.col = col
      selectedPiece.label = gameBoard[row][col]

      handleMove(row, col);
    }
  });
}

function queenAddEventListener(pawn) {
  pawn.click(function() {
    if ($(this).hasClass(`pawn-p${currentPlayer}`)){
      $('.tile').off('click', '.valid-move, .eating-move')
      $('.valid-move').removeClass('valid-move');
      $('.eating-move').removeClass('eating-move');
      const row = Math.floor($(this).parent().index() / numRows); // Calculate row index
      const col = $(this).parent().index() % numCols; // Calculate column index
      
      selectedPiece.row = row
      selectedPiece.col = col
      selectedPiece.label = gameBoard[row][col]

      handleMove(row, col);
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
      let pawn = $('<div>');

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
          pawn.addClass('pawn')
          pawn.addClass(`pawn-p${currentTile}`)
          pawnAddEventListener(pawn)
          tile.append(pawn);
          break;
        
        case 3:
        case 4:
          if (!tile.hasClass('black-tile')) {
            tile.addClass('black-tile');
          }
          pawn.addClass('queen')
          pawn.addClass(`queen-p${(currentTile % 2) + 1}`)
          queenAddEventListener(pawn)
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

function checkForQueen() {
  for (let i = 0; i < numRows; i++) {
    if (gameBoard[0][i] === 2) {
      gameBoard[0][i] = 3
    }
    if (gameBoard[numRows - 1][i] === 1) {
      gameBoard[numRows - 1][i] = 4
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
  // const selectedPiece = gameBoard[row][col];

  if (selectedPiece.label === currentPlayer) {
    
    highlightValidMoves(row, col);
    
    // Add event listener for valid destination squares
    $('.valid-move').click(function(e) {
      e.preventDefault();
      const destRow = Math.floor($(this).index() / numRows);
      const destCol = $(this).index() % numCols;

      // Implement the movement logic
      // console.log(gameBoard);
      if (destCol !== undefined && destRow !== undefined){
        if (gameBoard[destRow][destCol] === 0 ) {
          gameBoard[destRow][destCol] = selectedPiece.label;
          gameBoard[selectedPiece.row][selectedPiece.col] = 0; // Clear the source square
          $('.tile').off('click', '.valid-move, .eating-move')
          $('.valid-move').removeClass('valid-move');
          $('.eating-move').removeClass('eating-move');
          checkForQueen();
          switchTurn();
        }
      }
      renderBoard();
    });
  }
}

// Function to highlight valid moves for a selected piece
function highlightValidMoves(row, col) {
  // let selectedPiece = gameBoard[row][col];

  // Clear existing valid move highlights
  $('.tile').off('click', '.valid-move, .eating-move')
  $('.valid-move').removeClass('valid-move');
  $('.eating-move').removeClass('eating-move');

  // Define possible move directions based on the player
  let moveDirections = (selectedPiece.label === 2) ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

  // Check each move direction
  for (const direction of moveDirections) {
    let movementRow = row + direction[0]
    let movementCol = col + direction[1]

    let eatingRow = row + direction[0] * 2
    let eatingCol = col + direction[1] * 2

    // Check if the new position is within the bounds of the board
    if (movementRow >= 0 && movementRow < numRows && movementCol >= 0 && movementCol < numCols) {
      let targetPiece = gameBoard[movementRow][movementCol];
      // Check if the target square is empty
      if (targetPiece === 0) {
        $(`#r${movementRow}c${movementCol}.tile`).addClass('valid-move');
      } else if (targetPiece == 3 - currentPlayer) {
          if (eatingRow >= 0 && eatingRow < numRows && eatingCol >= 0 && eatingCol < numCols) {
            if (gameBoard[eatingRow][eatingCol] === 0)
              $(`#r${eatingRow}c${eatingCol}.tile`).addClass('valid-move').addClass('eating-move');
              $(`#r${eatingRow}c${eatingCol}.eating-move`).click(function () {
                gameBoard[movementRow][movementCol] = 0
              })
          }
      }
    }
  }
}

$(document).ready(function() {
  // Event listener for form submission
  $('.restart-button').click(function() {
    // Reset the game state and UI
    $('.board').empty();
    $('#nameForm').show();
    currentPlayer = 1
    moves = 0
    $('.turn').text(`Current Turn: ${playerNames[currentPlayer - 1]}`);
    $('.moves').text(`Number of Moves: ${moves}`);
  });

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