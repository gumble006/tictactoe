const { checkWinner, checkTie } = require('./util');

/*
  Module calculates all the possible moves available for the computer player, uses Minimax algorithm to determine the best possible move
*/

class AIMinMax {
  constructor(computerTeam, humanTeam) {
    this.minPlayer = humanTeam;
    this.maxPlayer = computerTeam;
  }

  /*
    Tests if a move is valid or not. Needs to return shallow clone each time to exhaust all unique game outcomes 
  */
  makeMove (player, move, board) {
    var newBoard = board.slice(0);
    if (newBoard[move] == null) {
      newBoard[move] = player;
      return newBoard;
    } else {
      return null;
    }
  }

  /*
    Primary funct to choose next move for AI
    Runs recursively, switching between min and max players until winner / tie game for each remaining possible game.
  */
  findMove (board) {
    let bestMoveValue = -100;
    let move = 0;
    board.forEach((spot,i) => {
      const newBoard = this.makeMove(this.maxPlayer, i, board);
      if (newBoard) {
        const predictedMoveValue = this.minValue(newBoard);
        if (predictedMoveValue > bestMoveValue) {
          bestMoveValue = predictedMoveValue;
          move = i;
        }
      }
    })
    
    return move;
  }

  minValue (board) {
    // Conditions check if each theoretical game is over
    if (checkWinner(this.maxPlayer, board)) {
      return 1;
    } else if (checkWinner(this.minPlayer, board)) {
      return -1;
    } else if (checkTie(board)) {
      return 0;
    } else {
      let bestMoveValue = 100;
      board.forEach((spot,i) => {
        const newBoard = this.makeMove(this.minPlayer, i, board);
        if (newBoard) {
          const predictedMoveValue = this.maxValue(newBoard);
          if (predictedMoveValue < bestMoveValue) {
            bestMoveValue = predictedMoveValue;
          }
        }
      })
      
      return bestMoveValue;
    }
  }

  maxValue (board) {
    // Conditions check if each theoretical game is over
    if (checkWinner(this.maxPlayer, board)) {
      return 1;
    } else if (checkWinner(this.minPlayer, board)) {
      return -1;
    } else if (checkTie(board)) {
      return 0;
    } else {
      let bestMoveValue = -100;
      board.forEach((spot,i) => {
        const newBoard = this.makeMove(this.maxPlayer, i, board);
        if (newBoard) {
          const predictedMoveValue = this.minValue(newBoard);
          if (predictedMoveValue > bestMoveValue) {
            bestMoveValue = predictedMoveValue;
          }
        }
      });

      return bestMoveValue;
    }
  }
}

module.exports = AIMinMax;
