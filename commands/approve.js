const Discord = require('discord.js');
const db = require('quick.db');
const { devs } = require('../settings.json');
const { downloading, approved } = require('../data/emojis.json');
const { invisible } = require('../data/colors.json');
const { logs } = require('../data/channels.json');
const { mods } = require('../settings.json');

module.exports = {
    name: 'approve',
    description: 'Approve a post',
    usage: '<id>',
    cooldown: '5',
    aliases: ["a"],
    async execute(client, message, args) {
        if(!mods.includes(message.author.id)) return;
        const downloadingM = await message.channel.send(`${downloading} Approving post...`);

        try {
            if(isNaN(args[0])) return message.channel.send(`Not a valid number.`)
            const total = await db.fetch(`egg.unapproved.totalPosts`);
            if(args[0] > total || args[0] < 0) return loadingM.edit(`That id does not exist!`);
            let i = args[0]-1;    
            const id = await db.fetch(`egg.unapproved.id[${i}]`);
            const image = await db.fetch(`egg.unapproved.image[${i}]`);
            const user = await db.fetch(`egg.unapproved.author[${i}]`);
            const userID = await db.fetch(`egg.unapproved.authorID[${i}]`);
            const avatar = await db.fetch(`egg.unapproved.avatar[${i}]`);
            const postedTime = await db.fetch(`egg.unapproved.time[${i}]`);
            const status = await db.fetch(`egg.status[${i}]`);

            if(status === "approved") return downloadingM.edit("Post has already been approved!")
            if(status === "rejected") return downloadingM.edit("Post has already been rejected!")

            db.add(`egg.totalPosts`, 1);
            const totalPosts = await db.fetch(`egg.totalPosts`);
            db.push(`egg.id`, totalPosts);
            db.push(`egg.image`, image);
            db.push(`egg.author`, user);
            db.push(`egg.authorID`, userID);
            db.add(`egg.count.${userID}`, 1);
            db.push(`egg.avatar`, avatar);
            db.push(`egg.upvotes`, 0);
            db.push(`egg.downvotes`, 0);
            db.push(`egg.time`, Date.now());
            db.set(`egg.status[${i}]`, "approved");
            
            downloadingM.edit("Successfully approved & uploaded post to database!!");

            client.channels.get(logs).send(`${approved} ${message.author.username} approved a post with id \`#${id}\`, submitted by ${user}`);
            //message.client.users.get(userID).send(`${approved} Your meme has been approved with id: \`${id}\`. Do \`egg meme ${id}\` to view it.`);
            message.client.users.get(userID).send(`${approved} Your meme has been approved.`);
        } catch(error){
            console.log(error);
            downloadingM.edit(`An error occured while uploading image to database! Please make sure you are uploading an image, and not something else.`);
        }
    },
};