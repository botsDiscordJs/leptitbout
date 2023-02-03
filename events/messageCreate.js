const Discord = require('discord.js')

module.exports = async (bot, message) => {
    
    let prefix= '?';

    let messageArray = message.content.split(' ')
    let args = messageArray.slice(1)
    let commandName = messageArray[0].slice(prefix.length)

    if(!message.content.startsWith(prefix)) {return;}

    let command = require(`../commands/${commandName}`)
    if(!command) {return message.reply("Il n'y a pas de commandes")}

    command.run(bot, message, args)
}