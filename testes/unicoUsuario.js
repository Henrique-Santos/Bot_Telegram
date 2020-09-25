const env = require('../.env');
const Telegraf = require('telegraf');
const bot = new Telegraf(env.token);

bot.start(ctx => {
    const from = ctx.update.message.from;
    console.log(from);
    if (from.id == '10919059173') {
        ctx.reply('Bem vindo Mestre!');
    } else {
        ctx.reply('Só falo com o meu Mestre!');
    }
});

bot.startPolling();