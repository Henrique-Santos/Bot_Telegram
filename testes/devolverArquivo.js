const env = require('../.env');
const Telegraf = require('telegraf');
const bot = new Telegraf(env.token);
const axios = require('axios');

/* Essa função recebe um audio e envia o mesmo audio, buscando o arquivo na api do Telegram
fazendo a requisição por meio do axios */
bot.on('voice', async ctx => {

    const id = ctx.update.message.voice.file_id;
    const resp = await axios.get(`${env.apiUrl}/getFile?file_id=${id}`);
    ctx.replyWithVoice({ url: `${env.apiFileUrl}/${resp.data.result.file_path}` })
});

// Fazendo o mesmo com uma foto, enviando a primeiro foto, com a menor resolução
bot.on('photo', async ctx => {

    const id = ctx.update.message.photo[0].file_id;
    const resp = await axios.get(`${env.apiUrl}/getFile?file_id=${id}`);
    ctx.replyWithPhoto({ url: `${env.apiFileUrl}/${resp.data.result.file_path}` });
});

bot.startPolling();