const env = require('../../.env');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const Telegraf = require('telegraf');
const bot = new Telegraf(env.token);
const session = require('telegraf/session'); 

const botoes = lista => Extra.markup(

    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns: 3 }
    )
);

bot.use(session());

/* Primeiro verifica o id se ele vier por meio de uma msg, e dps verifica caso ele venha
de uma callback, por exemplo um command, o primeiro true, verifica se objeto msg e callback
está correto ou valido e dps verifica a igualdade */
const verificarUsuario = (ctx, next) => {

    const mesmoIdMsg = ctx.update.message 
        && ctx.update.message.from.id === env.userId;
    const mesmoIdCallback = ctx.update.callback_query
        && ctx.update.callback_query.from.id === env.userId;

    if (mesmoIdMsg || mesmoIdCallback) {
        next();
    } else {
        ctx.reply('Desculpe, não fui autoriazado a conversar com você...');
    }
}

// Utilizando um outro middleware.
// Usando destruction retirando do Objeto ctx, o metodo reply
const processando = ({ reply }, next) => 
    reply('Processando...').then(() => next());

bot.start(verificarUsuario, async ctx => {

    ctx.session.lista = []; 
    const nome = ctx.update.message.from.first_name;
    await ctx.reply(`Seja bem vindo ${nome}!`);
    await ctx.reply('Escreva os items que você quer adicionar...');
});

bot.on('text', verificarUsuario, processando, ctx => {

    const item = ctx.update.message.text;
    ctx.session.lista.push(item);
    ctx.reply(`${item} adicionado!`, botoes(ctx.session.lista));
});

bot.action(/delete (.+)/, verificarUsuario, ctx => {

    ctx.session.lista = ctx.session.lista.filter(item => item !== ctx.match[1]);
    ctx.reply(`${ctx.match[1]} deletado!`, botoes(ctx.session.lista));
});

bot.startPolling();