const env = require('../.env');
const Telegram = require('telegraf/telegram');
const axios = require('axios');
const Markup = require('telegraf/markup');

const enviarMensagem = msg => {

    // O encodeURI, faz com que a msg recebida, vá corretamente, para fazer o GET, pois ela faz parte do endereço
    axios.get(`${env.apiUrl}/sendMessage?chat_id=${env.userId}&text=${encodeURI(msg)}`)
        .catch(e => console.log(e));
};

enviarMensagem('Enviando a mensagem de forma assíncrona');

const teclado = Markup.keyboard([
    ['Ok', 'Cancelar']
]).resize().oneTime().extra();

const telegram = new Telegram(env.token);
telegram.sendMessage(env.userId, 'Essa é uma mensagem com teclado', teclado);