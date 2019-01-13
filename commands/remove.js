const Discord = require('discord.js');
const db = require('quick.db');
const { invisible } = require('../data/colors.json');
const { loading } = require('../data/emojis.json');
const { devs } = require('../settings.json');

module.exports = {
    name: 'remove',
    description: 'Removes a post from the database',
    args: true,
    usage: '<id>',
    async execute(client, message, args) {
        if(!devs.includes(message.author.id)) return;

        const loadingM = await message.channel.send(`${loading} Removing post...`);
        const totalPosts = await db.fetch(`egg.totalPosts`);
        if(isNaN(args[0])) return message.channel.send(`Not a valid number.`)
        if(args[0] > totalPosts || args[0] < 0) return loadingM.edit(`That id does not exist!`);
        let i = args[0]-1;

        db.delete(`egg.id[${i}]`);
        db.delete(`egg.image[${i}]`);
        db.delete(`egg.author[${i}]`);
        db.delete(`egg.authorID[${i}]`)
        db.delete(`egg.avatar[${i}]`);
        db.delete(`egg.upvotes[${i}]`);
        db.delete(`egg.downvotes[${i}`);

        return loadingM.edit(`Deleted Post #${args[0]} from the database.`);
    },  
};