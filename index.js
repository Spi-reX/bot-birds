const Discord = require("discord.js");
const bot = new Discord.Client();
const token = require("./token.json");
const fs = require("fs");
const bdd = require("./bdd.json");
const fetch = require('node-fetch');
const prefix = "-";
const moment = require ("moment");
const Canvas = require ('canvas');
const client = new Discord.Client();

// Project by Galaxy Birds | 2020
// install node module ! 
// check Module.js 

bot.on('message', message => {
	if (message.content === '!join') {
		bot.emit('guildMemberAdd', message.member);
	}
});


// STATUT //

bot.login(token.token);

bot.on("ready", async () => {
 
    let statuts  = bdd.stats
 setInterval(function() {
     let stats = statuts[Math.floor(Math.random()*statuts.length)];
     bot.user.setActivity(stats, {type: "STREAMING"} );
 }, 50000)

 console.log("chuis chaud patate")
 bot.user.setStatus("dnd");
 
});

// Message de bienvenue //

bot.on('guildMemberAdd', async member =>{
 const channel = member.guild.channels.cache.find(ch => ch.name === "🎉𝓫𝓲𝓮𝓷𝓿𝓮𝓷𝓾𝓮🎉");
  if (!channel) return;

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('./cvs.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.font = '50px Impact';
  ctx.fillStyle = '#ffffff'
  ctx.fillText(`${member.displayName}`, canvas.width / 2.8, canvas.height / 1.4);
  ctx.textAlign = 'center';

  ctx.font = '50px 	Impact';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Bienvenue a toi ! ', canvas.width / 1.5, canvas.height / 2.8);
  ctx.textAlign = 'center';

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'cvs.jpg');

  channel.send(`:confetti_ball: Bienvenue sur :video_game:Multi game Community:video_game: passe un bon moment ici ! :confetti_ball:  ${member} `, attachment);

  member.roles.add('403264520450998283');
});



// message d info a modifier //

bot.on('message', message => {
if (message.content.startsWith("-info")) {
    if (message.mentions.users.first()) {
       user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    
    const member = message.guild.member(user);
    const Usinfo = new Discord.MessageEmbed()
    .setColor('#E75E00')
    .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Info_Simple.svg/1200px-Info_Simple.svg.png')
    .setTitle(`Information Sur ${user.username}#${user.discriminator} :`)
    .addField('ID du Compte : ', `${user.id}`, true)
    .addField('Pseudo dans ce serveur :', `${member.nickname !== null ? `${member.nickname}` : 'Aucun'}`, true)
    .addField('Compte creer le :', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
    .addField('Nous a Rejoint le :', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
    .addField('Status', `${member.presence.status}`, true)
    .addField('Joue a :', `${user.presence.game ? user.presence.game.name : 'Rien'}`, true)
    .addField('Roles :', member.roles.cache.map(roles => `${roles.name}`).join(', '), true)
    .addField(`Reponse a :`, `${message.author.username}#${message.author.discriminator}`)
    
message.channel.send(Usinfo).then(message => message.delete({ timeout: 150000}));
}});



// message de clear //

bot.on("message", message =>{  

   if(message.content.startsWith("-clear")){
   message.delete();
       if(message.member.hasPermission("MANAGE_MESSAGES")){
    
       
        let args = message.content.trim().split(/ +/g);
        
        if(args[1]){
             if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){
              
                message.channel.bulkDelete(args[1])

            } 
            else{
                message.channel.send(`:x: vous devez indiquer un chiffre entre 1 et 99`)
            }          
        }
        else{
            message.channel.send(`:x: vous devez indiquer le nombres de messages a supprimer`)
        }
    }
    else{
        message.channel.send(`:no_entry: Tu n est pas Staff`)
    }

}

// message bienvenue //

if(message.content.startsWith("-mb")){ 
    message.delete()
    if(message.member.hasPermission("MANAGE_MESSAGES")){ 
        if(message.content.length > 5){
            message_bienvenue = message.content.slice(4)
            console.log(message_bienvenue)
            bdd["message-bienvenue"] = message_bienvenue
            savebdd()
        }
    }

}
 
// warn //

if(message.content.startsWith("-warn")){
    if(message.member.hasPermission('BAN_MEMBERS')){
        
        if(!message.mentions.users.first())return;
        utilisateur = message.mentions.users.first().id

        if(bdd["warn"][utilisateur] == 2){

          delete bdd["warn"][utilisateur]
          message.guild.members.ban(utilisateur)
        }
        else{
            if(!bdd["warn"][utilisateur]){
                bdd["warn"][utilisateur] = 1
                Savebdd() ;
                message.channel.send("Tu est a " + bdd["warn"][utilisateur] + " avertissement(s)");
            }
            else{
                bdd["warn"][utilisateur]++
                Savebdd() ;
                message.channel.send("Tu est a " + bdd["warn"][utilisateur] + " avertissements");

            }
        }
    }
}

 // stats //

if(message.content.startsWith("-stats")){
    let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
    let totalmembers = message.guild.members.cache.size;
    let totalservers = bot.guilds.cache.size;
    let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
    let totalrole = message.guild.roles.cache.get('403264520450998283').members.map(member => member.user.tag).length;

    const monembed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Birds Stats')
	.setURL('https://discord.js.org/')
	.setAuthor('Bot Birds', 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',)
	.setDescription('Voici les stats')
	.setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTeY0EpUpQwblOhJ33NonKAPIPMdGiQPFVTaA&usqp=CAUhttps://i.imgur.com/wSTFkRM.png')
	.addFields(
        { name: 'Membre Total', value:  totalmembers, inline: true },
        { name: 'Membre de co', value: onlines, inline: true },
        { name: 'Serveur de Bot Birds', value: totalservers, inline: true },
        { name: 'Bot present ici', value: totalbots, inline: true },
        { name: 'Gamer', value: totalrole, inline: true },


	)
	.setTimestamp()
	.setFooter('Stats by Bot Birds', 'https://lh3.googleusercontent.com/a-/AOh14Gi3SeXmqjO0nDqgxD-_EZOuODU0IBAUvZBlgtqm8A=s88-c-k-c0x00ffffff-no-rj-mo');

  message.channel.send(monembed);
}

});


bot.on("guildCreate", guild => {

    if(guild.id !== "Id serveur") return guild.leave()
    

    bdd[guild.id] = {}
    Savebdd()
});

// ping info //

bot.on('message', message => {
    if (message.content === prefix + "ping") {
    
            message.channel.send("Recherche du ping...").then(m => {
                var ping = m.createdTimestamp - message.createdTimestamp;
                m.edit(`**Mon ping est de  ${ping}ms !**`)
            });
        }
    });


    

  bot.on('message', message => {
    if (message.content === "ping") {
        message.channel.send("Pong !")
    }
  });

  bot.on('message', message => {
    if (message.content === "Ping") {
        message.channel.send("Pong !")
    }
  });

  bot.on('message', message => {
    if (message.content === "ping XD") {
        message.channel.send("Pong !")
    }
  });


  bot.on('message', message => {
      if (message.content === prefix + "maj") {
    const maj = new Discord.MessageEmbed()
    
    .setColor('#36ED3E')
    .setTitle('V 1.4.2')
    .setDescription(' **Voici les Info M.A.J ' + '**\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n Ajout du Canvas Bvn')
    .setFooter("Par Galaxy Birds" , "https://lh3.googleusercontent.com/a-/AOh14Gi3SeXmqjO0nDqgxD-_EZOuODU0IBAUvZBlgtqm8A=s88-c-k-c0x00ffffff-no-rj-mo")
    .setAuthor('Bot Birds' , 'https://cdn.discordapp.com/avatars/402935220749205505/3b825e5ef27072f794382df9a8498586.png?size=256')
    .addField(`Reponse a :`, `${message.author.username}#${message.author.discriminator}`)
    message.channel.send(maj);
    }
  });





  
  bot.on('message', message => {
         if (message.content === prefix + "i") {
            const info = new Discord.MessageEmbed()

            .setColor('#6C00FF')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Info_Simple.svg/1024px-Info_Simple.svg.png')
            .setTitle('Information De Bot Birds')
            .setDescription('**Ici toute les info' + '**\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n Mon Prefix est : -\n Mon hebergeur est : Gaming-Serv\n Mon fondateur est : Galaxy Birds\n Serveur Principal : Multi Games Comunnity ')
            .setFooter('V 1.3.6', 'https://lh3.googleusercontent.com/a-/AOh14Gi3SeXmqjO0nDqgxD-_EZOuODU0IBAUvZBlgtqm8A=s88-c-k-c0x00ffffff-no-rj-mo')
            

            message.channel.send(info);
         }
  });

  

bot.on("message", async message => {

    if(message.channel.type === "dm"){
        channel = bot.channels.cache.get('754514378707042334')
        channel.send(message.content)
    }
});


bot.on("message", async message => {if (message.content === '-help') {
    // message.delete()
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('#00FF00')
        .setTitle(':computer: **Menu des commandes :** :computer:')
        .setDescription(':file_folder: Commandes disponibles : 4\n:diamonds: Le prefix du serveur est : **' + prefix + ' **\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n:sos: Commandes publiques :\n```help, mphelp, stats, ping, info + @exemple, -i```\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n:no_entry: Commandes de modération :\n```clear, warn, ```\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n:name_badge: Commandes d\'Administration :\n```/```\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
        .setThumbnail('https://lh3.googleusercontent.com/proxy/bYX9wHanziIAfBO0loVhZxsuK1UUGCTkhOWj67BFkztXO7hx4X4PZnQ5bFJrS_welwmcDRKRveIACJOA_R9ini8gwSapzy7ThU5Lu0wxYDxDUGybw9aoZ5_mNaX4')
        .setTimestamp()
        .setFooter('BOT - Bot birds ©', 'https://www.iconfinder.com/data/icons/entypo/92/help-512.png');

    message.channel.send(helpEmbed);
}
if (message.content === '-mphelp') {
    message.delete()
    message.channel.send(`**Un Message Privé vient de vous être envoyé avec toutes les commandes du bot !**`).then(msg => {
        setTimeout(() => {
            msg.delete();
        }, 5000);
    });
    const helpmpEmbed = new Discord.MessageEmbed()
        .setColor('#00FF00')
        .setTitle(':computer: **Menu des commandes :** :computer:')
        .setDescription(':file_folder: Commandes disponibles : 4\n:diamonds: Le prefix du serveur est : **' + prefix + ' **\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n:sos: Commandes publiques :\n```help, mphelp, stats, ping, info + @exemple, -i```\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n:no_entry: Commandes de modération :\n```clear, warn,```\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n:name_badge: Commandes d\'Administration :\n```/```\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
        .setThumbnail('https://lh3.googleusercontent.com/proxy/bYX9wHanziIAfBO0loVhZxsuK1UUGCTkhOWj67BFkztXO7hx4X4PZnQ5bFJrS_welwmcDRKRveIACJOA_R9ini8gwSapzy7ThU5Lu0wxYDxDUGybw9aoZ5_mNaX4')
        .setTimestamp()
        .setFooter('BOT - Bot birds ©', 'https://www.iconfinder.com/data/icons/entypo/92/help-512.png');

    message.author.send(helpmpEmbed);
}




bot.on("guildCreate", guild => {
    bdd[guild.id] = {}
    Savebdd()
});





function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("une erreur a fait surface !");
    });
}





});
