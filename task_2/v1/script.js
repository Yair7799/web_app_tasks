$(document).ready(function() {
  let currentPlayer = 1; // Player 1 starts
  let playerNames = [];
  let gameBoard = []; // You can use a 2D array to represent the board state
  let moves = 0
  let isPawnClicked = 0
  const numRows = 8;
  const numCols = 8;

  // Function to initialize the game board and pieces
  function initializeBoard() {
    const board = $('.board');
  
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
        }
        // Create a square element and append it to the board
        const tile = $('<div>').addClass('tile');
        if (gameBoard[row][col] === 1) {
          tile.addClass('black-tile');
          const pawn = $('<div>').addClass('pawn');
          pawn.addClass('pawn-p1')
          tile.append(pawn);
        } else if (gameBoard[row][col] === 2) {
          tile.addClass('black-tile');
          const pawn = $('<div>').addClass('pawn');
          pawn.addClass('pawn-p2')
          tile.append(pawn);
        } else if (gameBoard[row][col] === 0) {
          tile.addClass('black-tile');
        } else if (gameBoard[row][col] === -1){
          tile.addClass('white-tile')
        }
        tile.appendTo(board);
      }
    }
  
    // Add event listeners for each board square to handle moves
    $('.pawn').click(function() {
      if (isPawnClicked === 0){
        console.log('clicked')
        isPawnClicked = 1
        const row = Math.floor($(this).parent().index() / numRows); // Calculate row index
        const col = $(this).parent().index() % numCols; // Calculate column index
        if ($(this).hasClass('pawn-p' + currentPlayer)){
          handleMove(row, col, this);
        }
      }
      else if (isPawnClicked === 1) {
        $('.tile').removeClass('valid-move')
        isPawnClicked = 0
      }
    });
  }

  // Function to switch turns between players
  function switchTurn() {
    currentPlayer = 3 - currentPlayer; // Toggle between 1 and 2
    $('.turn').text(`Current Turn: ${playerNames[1-moves%2]}`);
    moves ++;
    $('.moves').text(`Number of Moves: ${moves}`);
    isPawnClicked = 0
  }

  // Function to handle a move
  function handleMove(row,col, choosenPawn) {
    // Implement move validation, piece movement, capturing, and board update
    // Check for win conditions
    // Update the display
    const selectedPiece = gameBoard[row][col];
    //console.log(choosenPawn)
    // Check if the selected square contains the current player's piece
    if (selectedPiece === currentPlayer) {
      // Implement your movement logic here
      // For example, you can highlight possible valid moves for the selected piece
      // and handle the actual movement when a valid destination square is clicked
      
      highlightValidMoves(row, col);
      
      // Add event listener for valid destination squares
      $('.valid-move').click(function(e) {
        e.preventDefault();
        const destRow = Math.floor($(this).index() / numRows);
        const destCol = $(this).index() % numCols;
        
        // Implement the movement logic
        gameBoard[destRow][destCol] = selectedPiece;
        gameBoard[row][col] = 0; // Clear the source square
        //console.log(gameBoard);
        
        // Update the display
        $(this).append(choosenPawn);
        $('.valid-move').removeClass('valid-move');
        
        // Check for capturing and other game rules
        // Switch turns to the next player
        switchTurn();
        
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
          $(`.tile:eq(${newRow * numCols + newCol})`).addClass('valid-move');
        }
      }
    }
  }
  // Event listener for form submission
  $('#nameForm').submit(function(event) {
    playerNames = []
    $('.p1-title').hide();
    $('.p2-title').hide();
    event.preventDefault();
    $('#nameForm').hide();
    initializeBoard();
    playerNames.push($('#player1').val(), $('#player2').val());
    $('.turn').text(`Current Turn: ${playerNames[currentPlayer - 1]}`);
    $('.moves').text('Number of Moves: ' + moves)
    $('.player-titles').append($('<h3>').addClass('p1-title').text(`Player 1 (White): ${$('#player1').val()}`))
    $('.player-titles').append($('<h3>').addClass('p2-title').text(`Player 2 (Black): ${$('#player2').val()}`))
  });

  // Event listener for board squares
  $('.board').on('click', '.tile', function() {
    // Handle the move when a square is clicked
    // Use handleMove() function
  });

  // Event listener for restart button
  $('.restart-button').click(function() {
    // Reset the game state and UI
    $('.board').empty();
    $('#nameForm').show();
    currentPlayer = 1
    moves = 0
    $('.turn').text(`Current Turn: ${playerNames[currentPlayer - 1]}`);
    $('.moves').text(`Number of Moves: ${moves}`);
  });
});