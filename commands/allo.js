const Discord = require('discord.js')

module.exports = {
    name: 'allo',

    async run(bot, message){
        await message.reply(`@Paul @Antoine @Bastien @Andri`)
    }
}