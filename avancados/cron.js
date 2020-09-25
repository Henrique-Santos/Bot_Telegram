const env = require('../.env');
const schedule = require('node-schedule');
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const telegram = new Telegram(env.token);
const bot = new Telegraf(env.token);

let contador = 1;

const botoes = Extra.markup(Markup.inlineKeyboard([

    Markup.callbackButton('Cancelar', 'cancel')
]));

const notificar = () => {

    telegram.sendMessage(env.userId, `Essa é uma mensagem de evento: [${contador++}]`, botoes);
};

// A cada 5 segundos a função notificar é chamada.
const notificacao = new schedule.scheduleJob('*/5 * * * * *', notificar);

bot.action('cancel', ctx => {

    notificacao.cancel();
    ctx.reply('Ok, Parei de pertubar...');
});

bot.startPolling();