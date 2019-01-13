const Discord = require('discord.js');
const db = require('quick.db');
const validUrl = require("valid-url");
const { downloading, loading } = require('../data/emojis.json');
const { invisible } = require('../data/colors.json');
const { posts } = require('../data/channels.json');

module.exports = {
    name: 'upload',
    description: 'Uploads your meme to the database',
    usage: '<image>',
    cooldown: '120',
    async execute(client, message, args) {
        return message.channel.send("Uploading memes has now been disabled! Approvers need a break!");
        const downloadingM = await message.channel.send(`${downloading} Uploading to database...`);

        try {
            let img;
            if(!args[0]){
                img = message.attachments.first().url;
                if(!img) return downloadingM.edit(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`egg upload <image>\``)
            } else if(validUrl.isUri(args[0])){
                img = args[0];
            } else {
                return downloadingM.edit(`That was not a valid url ${message.author}.\nCorrect Usage: \`egg upload <image>\``);
            }

            db.add(`egg.unapproved.totalPosts`, 1);
            const totalPosts = await db.fetch(`egg.unapproved.totalPosts`);
            db.push(`egg.unapproved.id`, totalPosts);
            db.push(`egg.unapproved.image`, img);
            db.push(`egg.unapproved.author`, message.author.username);
            db.push(`egg.unapproved.authorID`, message.author.id);
            db.push(`egg.unapproved.avatar`, message.author.avatarURL);
            db.push(`egg.unapproved.time`, Date.now());
            db.push(`egg.status`, "unapproved")
    
            downloadingM.edit(`Successfully uploaded image to database!\n${loading} Waiting for approval from a human. (This system is in place so that no one posts nsfw content.)`);

            const embed = new Discord.RichEmbed()
            .setAuthor(`Posted by: ${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.displayAvatar)
            .setDescription(`ID Number: ${totalPosts}`)
            .setImage(img)
            .setColor(invisible)
            .setFooter("Awaiting for approval.")
            .setTimestamp();
            client.channels.get(posts).send(embed);
        } catch(error){
            console.log(error);
            downloadingM.edit(`An error occured while uploading image to database! Please make sure you are uploading an image/gif/video, and not something else.`);
        }
    },
};