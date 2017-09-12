const prompt = require('prompt');
const { checkWinner, checkTie, introScreen, coords, clearScreen } = require('./util');
const ai = require('./ai');

prompt.message = '>';
prompt.delimiter = '> ';
const cColor = ['\x1b[1m', '\x1b[0m\n'] // bright / reset

class Game {
  constructor() {
    this.board = [
      null,null,null,
      null,null,null,
      null,null,null
    ];

    this.humanTeam;
    this.computerTeam;
    this.computerAI;
    this.gameInPlay = true;
  }

  renderBoard (board) {
    const s = board.map(item => item === null ? ' ' : item );
    return `
    ${cColor[0]}
          A   B   C 
        +---+---+---+ 
      1 | ${s[0]} | ${s[1]} | ${s[2]} |
        +---+---+---+ 
      2 | ${s[3]} | ${s[4]} | ${s[5]} | 
        +---+---+---+ 
      3 | ${s[6]} | ${s[7]} | ${s[8]} | 
        +---+---+---+ 
    ${cColor[1]}`;
  }

  /*
    Ask for move until game over or user quits
  */
  askForMove(msg = null) {
    clearScreen();
    
    console.log(`
    Current Board:
    (you are ${this.humanTeam}'s, type coordinates to play, or 'q' to end game)\n
    ${this.renderBoard(this.board)}
    `);

    // schema for validating user input
    const schema = {
      properties: {
        move: {
          type: 'string',
          pattern: /^([a-c])([1-3])$|^([1-3])([a-c])$|q/i,
          message: 'Must be board coordinate or "q"',
          description: 'Choose your move',
          before: (input) => {
            const move = input.toUpperCase();
            if (move === 'Q') {
              return val;
            } else {
              // find board index from coord
              const coord = move.split('').sort().reverse().join('');
              return coords[coord];
            }
          }
        }
      }
    };
    
    if (msg) {console.log(msg);}
  
    // Prompt user for next move
    prompt.get(schema, this.handleMove.bind(this));
  }

  handleMove(err, result) {
    if (err) { console.log(err); return; };

    const { move } = result;

    if (move === 'Q') {
      console.log('We are done here. Thanks for playing!');
    } else {
      if (this.board[move] === null) {
        // available spot -> make human move
        this.makeMove(this.humanTeam, move);

        // make ai move
        if (this.gameInPlay) {
          this.makeMove(this.computerTeam, this.computerAI.findMove(this.board));
        }
        
        // repeat if needed
        if (this.gameInPlay) {
          this.askForMove();
        }
      } else {
        this.askForMove('Space already occupied!\n')
      }
    }
  }

  /*
    Make moves by each player, end game if tie/winner
  */
  makeMove(player, move){
    this.board[move] = player;

    if (checkWinner(player, this.board)) {
      this.gameInPlay = false;
      this.announceGameOver({ type: 'win', player });
    } else if (checkTie(this.board)) {
      this.gameInPlay = false;
      this.announceGameOver({ type: 'tie' })
    }
  }

  announceGameOver(result) {
    clearScreen();
    if (result.type === 'win') {
      console.log(`---------${result.player}'s WINS!---------`);

    } else if (result.type = 'tie') {
      console.log('---------Tie! Please play again---------');
    }

    const msg = `
      Final Board:
      (you were ${this.humanTeam}'s)
      ${this.renderBoard(this.board)}\n
    `;

    console.log(msg); 
  }

  /*
    Config teams for human / ai
  */
  configTeams(err, result) {
    if (err) { console.log(err); return; };

    const { team } = result;
    this.humanTeam = team;
    this.computerTeam = team === 'X' ? 'O' : 'X';
    this.computerAI = new ai(this.computerTeam, this.humanTeam);
    this.askForMove(`Ok, you will be ${team}'s`);
  }

  init(){
    clearScreen();
    console.log(cColor[0], introScreen, cColor[1]);
    console.log('Please choose team: X or O\n');

    const schema = {
      properties: {
        team: {
          type: 'string',
          pattern: /^x$|^o$/i,
          message: 'Must choose either X or O',
          description: 'Choose your team',
          before: (input) => input.toUpperCase()
        }
      }
    };

    // Prompt user for x or o
    prompt.get(schema, this.configTeams.bind(this));
  }
}

module.exports = Game;
