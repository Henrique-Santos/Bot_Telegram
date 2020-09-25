const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo, ${name}!`)
})

// Tratando um envio de texto
bot.on('text', ctx =>
    ctx.reply(`Texto '${ctx.update.message.text}' recebido com sucesso!`))

// Tratando um envio de localização
bot.on('location', ctx => {
    const location = ctx.update.message.location
    console.log(location)
    ctx.reply(`Entendido, você está em
        Lat: ${location.latitude},
        Lon: ${location.longitude}!`)
})

// Tratando um envio de contato
bot.on('contact', ctx => {
    const contact = ctx.update.message.contact
    console.log(contact)
    ctx.reply(`Vou lembrar do(a)
        ${contact.first_name} (${contact.phone_number})`)
})

// Tratando um envio de audio
bot.on('voice', ctx => {
    const voice = ctx.update.message.voice
    console.log(voice)
    ctx.reply(`Audio recebido, ele possui ${voice.duration} segundos`)
})

// Tratando um envio de foto
bot.on('photo', ctx => {
    const photo = ctx.update.message.photo
    console.log(photo)
    photo.forEach((ph, i) => {
        ctx.reply(`Photo ${i} tem resolução de ${ph.width}x${ph.height}`)
    })
})

// Tratando um envio de figurinhas
bot.on('sticker', ctx => {
    const sticker = ctx.update.message.sticker
    console.log(sticker)
    ctx.reply(`Estou vendo que você enviou
        o ${sticker.emoji} do conjunto ${sticker.set_name}`)
})

bot.startPolling()