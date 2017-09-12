module.exports = {
  
  introScreen: `
  -----  Tic Tac Toe!  -------
  ----      X O O        -----
  --        O X O          ---
  --        X O X           --
  ----------------------------\n`,
  
  // coord to board index dictionary
  coords: {
    A1:0,
    B1:1,
    C1:2,
    A2:3,
    B2:4,
    C2:5,
    A3:6,
    B3:7,
    C3:8
  },

  clearScreen: (clear) => {
    if (clear !== false) {
      process.stdout.write('\033[2J');
    }
    process.stdout.write('\033[0f');
  },

  checkWinner: (player,board) => {
    if (
      (board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player) ||
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player)
      ) {
      return true;
    } else {
      return false;
    }
  },

  checkTie: (board) => {
    return board.filter(spot => spot === null).length === 0;
  }
}


