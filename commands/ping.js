const Discord = require('discord.js');
const { loading } = require('../data/emojis.json');
const { avatar } = require('../settings.json');
const { invisible } = require('../data/colors.json');

module.exports = {
    name: 'ping',
    description: 'Egg\'s latency',
    async execute(client, message, args) {
        const loadingM = await message.channel.send(`${loading} Pinging...`);
        const embed = new Discord.RichEmbed()
        .setAuthor(client.user.username, avatar)
        .addField("🏓 Pong!", `Latency \`${loadingM.createdTimestamp - message.createdTimestamp}ms\`\nAPI Latency \`${Math.round(client.ping)}ms\``)
        .setColor(invisible)
        .setTimestamp();
        loadingM.edit(embed);
    },
};