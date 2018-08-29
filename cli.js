const readline = require('mz/readline')
const brain = require('./index')
const { ROCK, PAPER, SCISSORS, WON, LOST, DRAW } = require('./consts')
const { hasWon } = require('./rules')
;(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  let possibleChoices = { '1': true, '2': true, '3': true }
  let moves = [null, ROCK, PAPER, SCISSORS]
  let strings = {
    [ROCK]: '  Rock  ',
    [PAPER]: ' Paper  ',
    [SCISSORS]: 'Scissors'
  }
  let score = [0,0]

  while (true) {
    let answer = await rl.question(
      'Rock (1), paper (2), scissors (3) -- what do you pick?'
    )
    if (!possibleChoices[answer]) {
      console.log("Well, that's not a valid move, silly!")
      continue
    }
    let cliMove = moves[answer]
    let brainMove = brain.play('cli', cliMove)

    console.log('|---BRAIN---|---YOU---|')
    console.log(' ' + strings[brainMove] + '   ' + strings[cliMove])
    if (hasWon(cliMove, brainMove) === WON) {
      console.log('           (WINNER!)')
      score[1]+=1
    } else if (hasWon(cliMove, brainMove) === LOST) {
      console.log('(WINNER!)')
      score[0]+=1
    } else {
      console.log('       (DRAW)')
    }
    console.log('Score: BRAIN : HUMAN - ',score[0]+' : '+score[1])
  }
})()
