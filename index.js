const telegram = require('telegram-bot-api')
require('dotenv').config()

var bot = new telegram({
    token: process.env.TG_API_KEY,
    updates: {
        enabled: true
    }
})

const mp = new telegram.GetUpdateMessageProvider()
bot.setMessageProvider(mp)

bot.start()
.then(() => {
    console.log('API is started')
})
.catch(console.err)

exports.handler = () => {
    bot.on('update', update => {
        console.log(update.message.chat.id)
        console.log(update.message.text)
        bot.sendMessage({
            chat_id: update.message.chat.id,
            text: 'Hi, gentle reminder to transfer Zhen Kai the subscription.'
        })
    })
}

// todo:
// document some things down on paper maybe?
// add DDB integration by detecting /start only message
// add reply after successful registration
// cloudwatch event daily
// new lambda function to get number of items
// explore step functions???