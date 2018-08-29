const tf = require('@tensorflow/tfjs')
// Load the binding:
//require('@tensorflow/tfjs-node')
const { ROCK, PAPER, SCISSORS, WON, LOST, labels } = require('./consts')
const { hasWon } = require('./rules')

// Set the backend to TensorFlow:

//tf.setBackend('tensorflow')

const DEBUG = false

class TrainBrain {
  constructor(model) {
    this.model = model
  }

  play(history) {
    const prediction = tf.tidy(() => {
      const predTensor = this.model.predict(tf.tensor(history).expandDims())
      return predTensor.dataSync()
    })
    DEBUG && console.log('playing:', history, prediction)
    const probability = Math.max(
      prediction[0],
      Math.max(prediction[1], prediction[2])
    )
    var result
    switch (probability) {
      case prediction[0]:
        result = ROCK
        break
      case prediction[1]:
        result = PAPER
        break
      case prediction[2]:
        result = SCISSORS
        break
    }
    DEBUG && console.log('result: ', result)
    if (result) return result
    throw new Error('Could not determine prediction: ' + JSON.stringify(result))
  }
}

let brain
;(async function() {
  let model = await tf.loadModel('file://./models/final/model.json')
  brain = new TrainBrain(model)
})()

let games = {}
exports.play = function(player, moveB) {
  let history = games[player] || new Array(30).fill([0, 0, 0])
  moveA = brain.play(history)
  games[player] = history.concat([moveA, moveB]).slice(-30)
  return moveA
}

exports.calcScore = function(history) {
  const score = [0, 0]
  for (let i = 0, j = 1; j < history.length; i += 2, j += 2) {
    switch (hasWon(history[i], history[j])) {
      case WON:
        score[0] += 1
        break
      case LOST:
        score[1] += 1
        break
      default:
        break
    }
  }
  return score
}
