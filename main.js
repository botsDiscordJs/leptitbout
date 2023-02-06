const Discord = require('discord.js')
const config = require('./config')
const loadCommands = require('./loader/loadCommands')
const loadEvents = require('./loader/loadEvents')
const intents = new Discord.IntentsBitField(3276799)// 1099511627775
const bot = new Discord.Client({intents})

bot.commands = new Discord.Collection()


loadCommands(bot)
loadEvents(bot)


bot.on('messageCreate', async message=> {
    if(message.content === '!ping') return bot.commands.get('ping').run(bot, message)
})

// bot.on('messageCreate', async message=> {
//     if(message.content === '!degage') return bot.commands.get('degage').run(bot, message)
// })

// bot.on('ready', async () => {
//     console.log(`${bot.user.tag} est en ligne`)
// })

//move les utilisateurs dans le channel
bot.on('messageCreate', async msg=> {
    if (msg.content.startsWith('/move')) {
        const users = msg.mentions.users.map(u => u);
        const channel = msg.mentions.channels.first();
        
        if (!users.length) {
          msg.reply('Please mention the users you want to move.');
          return;
        }
      
        if (!channel ) { //|| channel.type !== 'voice'
          msg.reply('Please mention a valid voice channel you want to move the users to.');
        //   console.log(channel.type);
          return;
        }
      
        users.forEach(user => {
          const member = msg.guild.members.cache.get(user.id);
          if (!member) return;
          
          member.voice.setChannel(channel)
            .then(() => console.log(`Moved ${user.username} to ${channel.name}`))
            .catch(console.error);
        });
      }
})

//mute les utilisateurs pendant un certain temps
bot.on('messageCreate', async msg=> {
    if (msg.content.startsWith('/chatmute')) {
        const user = msg.mentions.users.first();
        const time = msg.content.split(' ')[2];
        
        if (!user) {
          msg.reply('Please mention the user you want to mute.');
          return;
        }
      
        if (!time) {
          msg.reply('Please specify the time in seconds for how long you want to mute the user.');
          return;
        }
      
        const member = msg.guild.members.cache.get(user.id);
        if (!member) return;
        
        const muteRole = msg.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
          msg.reply("The 'Muted' role doesn't exist. Please create it and make sure it has the `sendMessage` permission disabled.");
          return;
        }
        
        member.roles.add(muteRole)
          .then(() => {
            msg.reply(`Muted ${user.username} for ${time} seconds.`);
            setTimeout(() => {
              member.roles.remove(muteRole)
                .then(() => msg.reply(`Unmuted ${user.username}.`))
                .catch(console.error);
            }, time * 1000);
          })
          .catch(console.error);
      }
      
});

//mute voice of user
bot.on('messageCreate', async msg=> {

if (msg.content.startsWith('/vmute')) {
    const user = msg.mentions.users.first();
    const time = msg.content.split(' ')[2];
    
    if (!user) {
      msg.reply('Please mention the user you want to mute.');
      return;
    }
  
    if (!time) {
      msg.reply('Please specify the time in seconds for how long you want to mute the user.');
      return;
    }
    
    const member = msg.guild.members.cache.get(user.id);
    if (!member) return;
    
    msg.guild.channels.cache.forEach(channel => {
      if (channel.members.has(user.id)) {
        channel.members.get(user.id).voice.setMute(true)
          .then(() => {
            msg.reply(`Muted ${user.username}'s voice for ${time} seconds.`);
            setTimeout(() => {
              channel.members.get(user.id).voice.setMute(false)
                .then(() => msg.reply(`Unmuted ${user.username}'s voice.`))
                .catch(console.error);
            }, time * 1000);
          })
          .catch(console.log(error));
      }
    });
  }
  
});


bot.login(config.token)
