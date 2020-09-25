const env = require('../.env');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { enter, leave } = Stage;
const bot = new Telegraf(env.token);

bot.start(ctx => {

    const name = ctx.update.message.from.first_name;
    ctx.reply(`Seja bem vindo, ${name}!`);
    ctx.reply(`Entre com /echo ou /soma para iniciar...`); // Dois comandos usados para entrar nas duas scenas possiveis
})

const echoScene = new Scene('echo'); //Criando uma scena, que atende ao comando /echo
echoScene.enter(ctx => ctx.reply('Entrando em Echo Scene')); // Ao entrar na scena, é apresentado uma msg
echoScene.leave(ctx => ctx.reply('Saindo de Echo Scene')); // Ao sair da scena, é apresentado uma msg
echoScene.command('sair', leave()); // Atende o comando /sair, e volta a conversa principal, encerrando a scena /echo
echoScene.on('text', ctx => ctx.reply(ctx.message.text)); // Enviando a msg escrita pelo usuário
echoScene.on('message', ctx => ctx.reply('Apenas mensagens de texto, por favor')); // Caso não tenha sido enviado um texto, é apresentado essa msg

let sum = 0;
const sumScene = new Scene('sum');
sumScene.enter(ctx => ctx.reply('Entrando em Sum Scene'));
sumScene.leave(ctx => ctx.reply('Saindo de Sum Scene'));

// Utilizando um middleware na scena /soma
sumScene.use(async (ctx, next) => {

    await ctx.reply('Você está em Soma Scene, escreva números para somar');
    await ctx.reply('Outros comandos: /zerar /sair');
    next();
})

// Atendendo ao comando /zerar
sumScene.command('zerar', ctx => {

    sum  = 0;
    ctx.reply(`Valor: ${sum}`);
})

//Atendendo ao comando /sair
sumScene.command('sair', leave());

// Realizando a soma do número passado
sumScene.hears(/(\d+)/, ctx => {

    sum += parseInt(ctx.match[1]);
    ctx.reply(`Valor: ${sum}`);
})

sumScene.on('message', ctx => ctx.reply('Apenas números, por favor'));

//Criando uma Stage (palco), que recebe um array de scenas
const stage = new Stage([echoScene, sumScene])
bot.use(session());
bot.use(stage.middleware()); // Passando o palco que contem as cenas criadas, ao bot
bot.command('soma', enter('sum')); // Passando ao bot o comando que dá inicio a cena
bot.command('echo', enter('echo'));
bot.on('message', ctx => ctx.reply('Entre com /echo ou /soma para iniciar...'));

bot.startPolling();