const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

// Passando um Middleware
bot.start(ctx => {
    const from = ctx.update.message.from
    console.log(from)
    ctx.reply(`Seja bem vindo, ${from.first_name}!`)
})

// O async/await é usado para executar em ordem os metodos assincronos
bot.on('text', async (ctx, next) => {
    await ctx.reply('Mid 1')
    next()
})

bot.on('text', async ctx => {
    await ctx.reply('Mid 2')
})

// O polling fica de tempos em tempo, verificando com o servidor, se há alguma msg para ser tratada
bot.startPolling()