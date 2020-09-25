const env = require('../.env');
const Telegraf = require('telegraf');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

let descricao = '';
let preco = 0;
let data = null;

const confirmacao = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n'),
]));

// Os primeiro passo do wizard
const precoHandler = new Composer();
precoHandler.hears(/(\d+)/, ctx => {

    preco = ctx.match[1];
    ctx.reply('É para pagar que dia?');
    ctx.wizard.next(); // Passando para a próxima função da composição
});

// Caso o valor digitado não seja númerico
precoHandler.use(ctx => ctx.reply('Apenas números são aceitos...'));

// Os segundo passo do wizard
const dataHandler = new Composer();
dataHandler.hears(/(\d{2}\/\d{2}\/\d{4})/, ctx => {

    data = ctx.match[1];
    ctx.reply(`Aqui está um resumo da sua compra:
        Descrição: ${descricao}
        Preço: ${preco}
        Data: ${data}
    Confirma?`, confirmacao);
    ctx.wizard.next();
});

// Caso a data não siga o formato especificado
dataHandler.use(ctx => ctx.reply('Entre com uma data no formato: dd/MM/YYYY'));

// Os terceio passo do wizard
const confirmacaoHandler = new Composer();
confirmacaoHandler.action('s', ctx => {

    ctx.reply('Compra confirmada!');
    ctx.scene.leave();
});

confirmacaoHandler.action('n', ctx => {

    ctx.reply('Compra excluida!');
    ctx.scene.leave();
});

// Caso ele não interaja com o botão inline
confirmacaoHandler.use(ctx => ctx.reply('Apenas confirme', confirmacao));

// Criando a wizard, passando o seu nome, e dps a cadeia de execuções que ele deve seguir
const wizardCompra = new WizardScene('compra',

    ctx => {
        ctx.reply('O que você comprou:');
        ctx.wizard.next();
    },
    ctx => {
        descricao = ctx.update.message.text;
        ctx.reply('Quanto foi?');
        ctx.wizard.next();
    },
    precoHandler,
    dataHandler,
    confirmacaoHandler
);

const bot = new Telegraf(env.token);
// Passando o wizard scene ao stage, dizendo qual a scene padrão
const stage = new Stage([wizardCompra], { default: 'compra' });
bot.use(session());
bot.use(stage.middleware()); // Para poder ter acesso as cenas

bot.startPolling();