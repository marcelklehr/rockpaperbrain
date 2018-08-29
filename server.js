const Koa = require('koa')
const router = require('koa-joi-router')
const Joi = router.Joi

const brain = require('./')
const rules = require('./rules')
const consts = require('./consts')

const public = router()

public.get('/', async ctx => {
  ctx.type = 'text/html'
  ctx.body = require('fs').createReadStream(__dirname + '/index.html')
})

public.route({
  method: 'post',
  path: '/play',
  validate: {
    body: {
      player: Joi.string().max(100),
      move: Joi.string().regex(/ROCK|PAPER|SCISSORS/)
    },
    type: 'json',
    output: {
      200: {
        body: {
          playerMove: Joi.string().regex(/ROCK|PAPER|SCISSORS/),
          botMove: Joi.string().regex(/ROCK|PAPER|SCISSORS/),
          won: Joi.boolean()
        }
      }
    }
  },
  handler: async ctx => {
    const playerMove = consts[ctx.request.body.move]
    const brainMove = brain.play(ctx.request.body.player, playerMove)
    ctx.status = 200
    ctx.body = {
      playerMove: consts.labels[playerMove],
      botMove: consts.labels[brainMove],
      won: rules.hasWon(playerMove, brainMove)
    }
  }
})

const app = new Koa()
app.use(public.middleware())
app.listen(parseInt(process.env['NODE_PORT']))
