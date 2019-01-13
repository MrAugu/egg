const Discord = require('discord.js');
const db = require('quick.db');
const { devs } = require('../settings.json');
const { downloading, rejected } = require('../data/emojis.json');
const { invisible } = require('../data/colors.json');
const { logs } = require('../data/channels.json');
const { mods } = require('../settings.json');

module.exports = {
    name: 'reject',
    description: 'reject a post',
    usage: '<id> <reason>',
    args: 'true',
    cooldown: '5',
    aliases: ['r'],
    async execute(client, message, args) {
        if(!mods.includes(message.author.id)) return;
        const downloadingM = await message.channel.send(`${downloading} Rejecting post...`);

        try {
            if(!args[1]) return downloadingM.edit("Please provide a reason for this rejection!");
            if(isNaN(args[0])) return message.channel.send(`Not a valid number.`)
            const total = await db.fetch(`egg.unapproved.totalPosts`);
            if(args[0] > total || args[0] < 0) return loadingM.edit(`That id does not exist!`);
            let i = args[0]-1;   
            const status = await db.fetch(`egg.status[${i}]`) 

            if(status === "approved") return downloadingM.edit("Post has already been approved!")
            if(status === "rejected") return downloadingM.edit("Post has already been rejected!")

            let reason = args.slice(1).join(' ');

            const id = await db.fetch(`egg.unapproved.id[${i}]`);
            const user = await db.fetch(`egg.unapproved.author[${i}]`);
            const userID = await db.fetch(`egg.unapproved.authorID[${i}]`);
            db.delete(`egg.unapproved.id[${i}]`);
            db.delete(`egg.unapproved.image[${i}]`);
            db.delete(`egg.unapproved.author[${i}]`);
            db.delete(`egg.unapproved.authorID[${i}]`)
            db.delete(`egg.unapproved.avatar[${i}]`);
            db.delete(`egg.unapproved.time[${i}]`);
            db.set(`egg.status[${i}]`, "rejected");

            downloadingM.edit("Successfully rejected & removed post to database!");

            client.channels.get(logs).send(`${rejected} ${message.author.username} rejected a post with id \`#${id}\`, submitted by ${user}. Reason: ${reason}`);
            message.client.users.get(userID).send(`${rejected} Your meme has been rejected. \nReason: ${reason}!`);
        } catch(error){
            console.log(error);
            downloadingM.edit(`An error occured while uploading image to database! Please make sure you are uploading an image, and not something else.`);
        }
    },
};