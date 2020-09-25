const env = require('../.env');
const Markup = require('telegraf/markup'); // Responsavel por desenhar o teclado personalizado
const Telegraf = require('telegraf');
const bot = new Telegraf(env.token);

// resize() ajusta a dimensão do teclado, e o extra() renderiza o teclado
const tecladoCarne = Markup.keyboard([

    ['🐷 Porco', '🐮 Vaca', '🐑 Carneiro'],
    ['🐔 Galinha', '🐣 Eu como é ovo'],
    ['🐟 Peixe', '🐙 Frutos do mar'],
    ['🍄 Eu sou vegetariano']
]).resize().extra();

bot.start(async ctx => {

    const nome = ctx.update.message.from.first_name;
    await ctx.reply(`Seja Bem Vindo, ${nome}`);
    await ctx.reply('Qual bebida você prefere ?',
        Markup.keyboard(['Coca', 'Pepsi']).resize().oneTime().extra()
    );
});

bot.hears(['Coca', 'Pepsi'], async ctx => {

    await ctx.reply(`Nossa, eu também gosto de ${ctx.match}`);
    await ctx.reply(`Qual a sua carne predileta ?`, tecladoCarne);
});

bot.hears('🐮 Vaca', ctx => ctx.reply('A minha predileta também') );    
bot.hears('🍄 Eu sou vegetariano', 
    ctx => ctx.reply('Parabéns, mais eu ainda gosto de carne.') );    
bot.on('text', ctx => ctx.reply('Legal'));

bot.startPolling();