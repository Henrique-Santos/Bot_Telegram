const env = require('../../.env');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const Telegraf = require('telegraf');
const bot = new Telegraf(env.token);
const session = require('telegraf/session'); // A sessão deve ser declarada dps da criação do bot

bot.use(session());

const botoes = lista => Extra.markup(

    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns: 3 }
    )
);

bot.start(async ctx => {

    ctx.session.lista = []; // Iniciando a lista dentro da sessão
    const nome = ctx.update.message.from.first_name;
    await ctx.reply(`Seja bem vindo ${nome}!`);
    await ctx.reply('Escreva os items que você quer adicionar...');
});

bot.on('text', ctx => {

    const item = ctx.update.message.text;
    ctx.session.lista.push(item);
    ctx.reply(`${item} adicionado!`, botoes(ctx.session.lista));
});

bot.action(/delete (.+)/, ctx => {

    ctx.session.lista = ctx.session.lista.filter(item => item !== ctx.match[1]);
    ctx.reply(`${ctx.match[1]} deletado!`, botoes(ctx.session.lista));
});

bot.startPolling();