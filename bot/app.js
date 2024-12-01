import { Telegraf, Markup } from 'telegraf'

const token = '7282033643:AAGIEeix-YJL5O3KAEQ2y6cqe0SddjGyh-I'
const webAppUrl = 'https://dynamic-master-lion.ngrok-free.app/'

const bot = new Telegraf(token)

bot.command('start', (ctx) => {
  ctx.reply(
    'Hello! Press to start the app',
    Markup.inlineKeyboard([
      Markup.button.webApp('Open mini app', `${webAppUrl}?ref=${ctx.payload}`),
    ])
  )
})

bot.launch()
