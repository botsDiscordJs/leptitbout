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

if (msg.content.startsWith('/vmute') || msg.content.startsWith('/chut') ) {
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
      if (channel.members.has(user.id) && channel.type ===2) {
        channel.members.get(user.id).voice.setMute(true)
          .then(() => {
            msg.reply(`Muted ${user.username}'s voice for ${time} seconds. (${channel.name})`);
            setTimeout(() => {
              channel.members.get(user.id).voice.setMute(false)
                .then(() => msg.reply(`Unmuted ${user.username}'s voice. (${channel.name})`))
                .catch((error) => console.error);
            }, time * 1000);
          })
          .catch((error)=> console.log(error));
      }
    });
  }
  
});

//move all members in other channel
bot.on('messageCreate', async msg=> {
    if (msg.content.startsWith('/cmove')) {
        const sourceVoiceChannelName = msg.content.split(' ')[1];
        const destinationVoiceChannelName = msg.content.split(' ')[2];
        
        if (!sourceVoiceChannelName || !destinationVoiceChannelName) {
          msg.reply('Please specify the source voice channel and the destination voice channel.');
          return;
        }
        
        const sourceVoiceChannel = msg.guild.channels.cache.find(channel => channel.name === sourceVoiceChannelName && channel.type === 2);
        const destinationVoiceChannel = msg.guild.channels.cache.find(channel => channel.name === destinationVoiceChannelName && channel.type === 2);
        
        if (!sourceVoiceChannel) {
          msg.reply(`Could not find the source voice channel "${sourceVoiceChannelName}".`);
          return;
        }
        
        if (!destinationVoiceChannel) {
          msg.reply(`Could not find the destination voice channel "${destinationVoiceChannelName}".`);
          return;
        }
        
        sourceVoiceChannel.members.forEach(member => {
            member.voice.setChannel(destinationVoiceChannel)
            .catch(console.error);
        });
        
        msg.reply(`Moved all members from "${sourceVoiceChannelName}" to "${destinationVoiceChannelName}".`);
      }
      
});

bot.on('messageCreate', async msg=> {
    if (msg.content.startsWith('/teams')) {
        const members = msg.mentions.users;
        
        if (members.size < 2) {
          msg.reply('Please mention at least two users.');
          return;
        }
        
        const shuffledMembers = Array.from(members.values()).sort(() => Math.random() - 0.5);
        const team1 = shuffledMembers.slice(0, Math.ceil(shuffledMembers.length / 2));
        const team2 = shuffledMembers.slice(Math.ceil(shuffledMembers.length / 2));
        
        msg.reply(`Team 1: ${team1.map(member => member.username).join(', ')}\nTeam 2: ${team2.map(member => member.username).join(', ')}`);
      }
      
});

bot.on('messageCreate', async msg=> {
    
      
});


bot.login(config.token)
