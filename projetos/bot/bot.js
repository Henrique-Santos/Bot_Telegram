const env = require('../../.env');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Telegraf = require('telegraf');
const bot = new Telegraf(env.token);
const axios = require('axios');

/* Isso cria apenas um atalho de digitação no teclado */
const tecladoOpcoes = Markup.keyboard([

    ['🤖 O que são bots ?', '❓ O que tem de interessante ?'],
    ['🗓 Posso mesmo automatizar tarefas ?'],
    ['🛠 Como fazer um bot ?']
]).resize().extra();

/* Já esse cria um teclado inline que dispara eventos que pode ser tratados */
const botoes = Extra.markup(Markup.inlineKeyboard([

    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n'),
], { columns: 2 }));

const localizacao = Markup.keyboard([

    Markup.locationRequestButton('Clique aqui para enviar sua localização')    
]).resize().oneTime().extra();

bot.start(async ctx => {

    const nome = ctx.update.message.from.first_name;
    await ctx.replyWithMarkdown(`*Olá ${nome}!* \n Eu sou o chatbot `);
    await ctx.replyWithPhoto('http://files.cod3r.com.br/curso-bot/bot.png');
    await ctx.replyWithMarkdown('_Posso te ajudar em algo ?_', tecladoOpcoes);
});

bot.hears('🤖 O que são bots ?', ctx => {

    ctx.replyWithMarkdown('Bots são bots, ué... \n _Algo mais ?_', tecladoOpcoes);
});

bot.hears('❓ O que tem de interessante ?', async ctx => {

    await ctx.replyWithMarkdown('Muita coisa... \n');
    await ctx.reply('1. Um bot pode gerenciar sua lista de compras.');
    await ctx.reply('2. Um bot pode cadastrar seus eventos.');
    await ctx.reply('etc...');
    await ctx.replyWithMarkdown('\n _Algo mais ?_', tecladoOpcoes);
});

bot.hears('🗓 Posso mesmo automatizar tarefas ?', async ctx => {

    await ctx.replyWithMarkdown('Claro que sim, o bot servira... \n Quer uma palhinha ?', botoes);
});

bot.action('n', ctx => {

    ctx.reply('Ok, não precisa ser grosso :(', tecladoOpcoes);
});

bot.action('s', ctx => {

    ctx.reply('Ok, tente me enviar a sua localização, ou escreva uma msg qualquer...', localizacao);
});

bot.hears(/mensagem qualquer/i, ctx => {

    ctx.reply('Essa piada é velha, tente outra...', tecladoOpcoes);
});

bot.on('text', async ctx => {

    let msg = ctx.message.text;
    msg = msg.split('').reverse().join('');
    await ctx.reply(`A sua mensaguem ao contrario é: ${msg}`);
    await ctx.reply('Isso mostra que eu consigo ler e processar a sua mensagem.', tecladoOpcoes);
});

bot.on('location', async ctx => {

    try {
        const url = 'http://api.openweathermap.org/data/2.5/weather';
        const { latitude: lat, longitude: lon } = ctx.message.location;
        console.log(lat, lon);
        const resp = await axios.get(`${url}?lat=${lat}&lon=${lon}&APPID=d1511249e345599ff0559312d64c15ad&units=metric`);
        await ctx.reply(`Humm... Você está em: ${resp.data.name}`);
        await ctx.reply(`A temperatura por aí está em: ${resp.data.main.temp}°C`, tecladoOpcoes);
    } catch(e) {
        ctx.reply('Estou com problemas para pegar a sua localização, Você está no planeta terra? :P', tecladoOpcoes);
    }
});

bot.startPolling();