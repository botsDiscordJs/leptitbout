const Discord = require('discord.js')

module.exports = {
    name: "kick",
    description: "le membre a kick",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: 'le membre a kick',
            required: true,
        },
        {
            type: "string",
            name: "reason",
            description: "la raison du kcik",
            required: false,
        }
    ],


    async run(bot, message, args){

        

            let user = args.getUser("membre")
            if(!user) return message.reply('Pas de membre à kick ')
            let member = message.guild.members.cache.get(user.id)
            if(!member) return message.reply('Pas de membre a kick')

            let reason =  args.get('reason').value
            if(!reason) reason = 'Abus de pouvoir'

            if(message.user.id === user.id) return message.reply("Pourquoi tu te kick toi même!")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Ne kick pas l'owner du serv")
            if(member && !member?.bannable) return message.reply("Je ne peux pas kick ce membre !")
            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest)<=0) return message.reply("Tu ne peux pas kick cette personne")

            try{await user.send(`Tu as été kick du server ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\``)} catch(err){}

            await message.reply(`${message.user} a kick ${user.tag} pour la raison :  \`${reason}\``)
            await member.kick(reason)
    }
}