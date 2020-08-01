var AWS = require("aws-sdk")
var docClient = new AWS.DynamoDB.DocumentClient({region: "ap-southeast-1"})
const telegram = require('telegram-bot-api')

const tableName = process.env.DDB_TABLE_NAME

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
        var params = {
            TableName: tableName,
            Item: { 
                username: update.message.from.username,
                chat_id: update.message.chat.id,
            }
        }

        console.log("Adding a new item...")
        docClient.put(params, (err) => {
            if (err) {
                console.log('error cant read.', JSON.stringify(err, null, 2))
                bot.sendMessage({
                    chat_id: update.message.chat.id,
                    text: `Registration to Mr Gentle Reminderer is unsuccessful. Please let Zhen Kai know of the error. ${JSON.stringify(err, null, 2)}`
                }).catch(error => { console.log(error) })
            } else {
                console.log('succeed')
                bot.sendMessage({
                    chat_id: update.message.chat.id,
                    text: 'Registration to Mr Gentle Reminderer is successful! The gentle reminder will be sent on the first day of every month. Thanks!'
                }).catch(error => { console.log(error) })
            }
        })
    })
}