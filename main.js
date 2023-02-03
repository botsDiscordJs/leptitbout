const Discord = require('discord.js')
const config = require('./config')
const loadCommands = require('./loader/loadCommands')
const loadEvents = require('./loader/loadEvents')
const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({intents})

bot.commands = new Discord.Collection()

bot.login(config.token)
loadCommands(bot)
loadEvents(bot)

// bot.on('messageCreate', async message=> {
//     if(message.content === '!ping') return bot.commands.get('ping').run(bot, message)
// })
// bot.on('messageCreate', async message=> {
//     if(message.content === '!allo') return bot.commands.get('allo').run(bot, message)
// })

// bot.on('ready', async () => {
//     console.log(`${bot.user.tag} est en ligne`)
// })