const { ROCK, PAPER, SCISSORS, WON, LOST, DRAW } = require('./consts')

var rules = {
  [ROCK]: {
    [ROCK]: DRAW,
    [PAPER]: LOST,
    [SCISSORS]: WON
  },
  [PAPER]: {
    [ROCK]: WON,
    [PAPER]: DRAW,
    [SCISSORS]: LOST
  },
  [SCISSORS]: {
    [ROCK]: LOST,
    [PAPER]: WON,
    [SCISSORS]: DRAW
  }
}
exports.rules = rules

exports.hasWon = hasWon
function hasWon(move1, move2) {
  return rules[move1][move2]
}
