const Discord = require('discord.js')

module.exports = {
    name: 'ping',

    async run(bot, message){
        await message.reply(`Les roux ils sont trop beaux ! A oui ton ping c'est : \`${bot.ws.ping}\``)
    }
}