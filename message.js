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

var params = {
    TableName: tableName,
    ProjectionExpression: "chat_id"
}

exports.handler = () => {

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2))
        } else {
            console.log("Scan succeeded")
            data.Items.forEach(chatIdObj => {
                console.log('Chat ID is:', chatIdObj.chat_id)
                bot.sendMessage({
                    chat_id: chatIdObj.chat_id,
                    text: 'Gentle reminder to transfer the monthly subscription fee to the subscriber. Thanks!'
                }).catch(error => { console.log(error) })
            })
            
        }
    })
}