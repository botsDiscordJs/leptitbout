const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "display ping of a user",
    permission: "Aucune",
    dm: true,
    // options: [],


    async run(bot, message){
        await message.reply(`Les roux ils sont trop beaux ! A oui ton ping c'est : \`${bot.ws.ping}\``)
    }
}