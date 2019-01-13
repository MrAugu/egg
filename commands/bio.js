const Discord = require('discord.js');
const db = require('quick.db');
const { invisible } = require('../data/colors.json');
const { loading } = require('../data/emojis.json');

module.exports = {
    name: 'bio',
    description: 'Sets the user\'s bio.',
    usage: '<description>',
    args: true,
    cooldown: `60`,
    aliases: ['setbio', 'set-bio', 'bioset'],
    async execute(client, message, args) {
        const loadingM = await message.channel.send(`${loading} Setting bio...`);

        let bio = args.slice(0).join(" ");
        if(bio.length > 200) return loadingM.edit("Bio must be less than 200 characters.");
        db.set(`egg.bio.${message.author.id}`, bio);

        return loadingM.edit(`Successfully set your bio to: \`${bio}\``)
    },  
};