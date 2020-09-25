const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(async ctx => {
    await ctx.reply(`Seja bem vindo, ${ctx.update.message.from.first_name}! 😎`)
    await ctx.replyWithHTML(`Destacando mensagem <b>HTML</b>
        <i>de várias</i> <code>formas</code> <pre>possíveis</pre>
        <a href="http://www.google.com">Google</a>`)
    await ctx.replyWithMarkdown('Destacando mensagem *Markdown*'
        + ' _de várias_ `formas` ```possíveis```'
        + ' [Google](http://www.google.com)')
    await ctx.replyWithPhoto({ source: `${__dirname}/cat.jpeg` },
        { caption: 'Olha o estilo!' })
    await ctx.replyWithLocation(29.9773008, 31.1303068)
})

bot.startPolling()