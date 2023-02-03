const Discord = require('discord.js')

module.exports = {
    name: "degage",
    description: "le membre a virer",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: 'le membre a ban',
            required: true,
        },
        {
            type: "string",
            name: "reason",
            description: "la raison du bannissement",
            required: false,
        }
    ],


    async run(bot, message, args){

        try{

            let user =  await bot.users.fetch(args._hoistedoptions[0].value)
            if(!user) return message.reply('Pas de membre à bannir ')
            let member = message.guild.members.cache.get(user.id)

            let reason =  args.get('reason').value
            if(!reason) reason = 'Abus de pouvoir'

            if(message.user.id === user.id) return message.reply("Pourquoi tu te ban toi même!")
            if((await message.guild.fetchOwner()).id === user.id) return message.reply("Ne ban pas l'owner du serv")
            if(member && !member?.bannable) return message.reply("Je ne peux pas bannir ce membre !")
            if(member && message.member.roles.highest.comparePositionTo(member.roles.highest)<=0) return message.reply("Tu ne peux pas bannir cette personne")
            if((await message.guild.bans.fetch()).get(user.id)) return message.reply("Ce membre est déja ban !")  

            try{await user.send(`Tu as été banni du server ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\``)} catch(err){}

            await message.reply(`${message.user} a éjecté ${user.tag} pour la raison :  \`${reason}\``)
            await message.guild.bans.create(user.id, {reason: reason})

            }
        catch (err){
            return message.reply('Pas de membre à bannir')
        }
    }
}