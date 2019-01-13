const Discord = require('discord.js');
const db = require('quick.db');
const sm = require("string-similarity");
const { invisible } = require('../data/colors.json');
const { loading } = require('../data/emojis.json');

module.exports = {
    name: 'profile',
    description: 'Displays the user\`s profile',
    usage: '<user>',
    async execute(client, message, args) {
        const loadingM = await message.channel.send(`${loading} Fetching profile...`);

        if(!args[0]){
            let count = await db.fetch(`egg.count.${message.author.id}`);
            let bio = await db.fetch(`egg.bio.${message.author.id}`);
            let eggs = await db.fetch(`egg.eggs.${message.author.id}`);
            if(bio == null) bio = "No bio set";
            if(count == null) count = 0;
            if(eggs == null) eggs = 10;

            let embed = new Discord.RichEmbed()
            .setThumbnail(message.author.avatarURL)
            .addField("User", message.author.tag, true)
            .addField("Eggs", `🥚 ${eggs}`, true)
            .addField("Bio", bio)
            .setColor(invisible)
            .setFooter(`${count} posts`)
            .setTimestamp();
            return loadingM.edit(embed);
        }

        let members = [];
        let indexes = [];
        message.guild.members.forEach(function(member) {
            members.push(member.user.username);
            indexes.push(member.id);
        })
        const match = sm.findBestMatch(args.join(' '), members);
        const username = match.bestMatch.target;
        const memberSmart = message.guild.members.get(indexes[members.indexOf(username)]);
        const memberMention = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!memberMention) {
            if(!memberSmart) return message.channel.send("User not found.");

            let bio = await db.fetch(`egg.bio.${memberSmart.user.id}`);
            let count = await db.fetch(`egg.count.${memberSmart.user.id}`);
            let eggs = await db.fetch(`egg.eggs.${memberSmart.user.id}`);
            if(bio == null) bio = "No bio set";
            if(count == null) count = 0;
            if(eggs == null) eggs = 10;

            let embed = new Discord.RichEmbed()
            .setThumbnail(memberSmart.user.displayAvatarURL)
            .addField("User", memberSmart.user.tag, true)
            .addField("Eggs", `🥚 ${eggs}`, true)
            .addField("Bio", bio)
            .setColor(invisible)
            .setFooter(`${count} posts`)
            .setTimestamp();
            return loadingM.edit(embed);
        } else {
            if(!memberMention) return loadingM.edit("User not found.");

            let bio = await db.fetch(`egg.bio.${memberMention.user.id}`);
            let count = await db.fetch(`egg.count.${memberMention.user.id}`);
            let eggs = await db.fetch(`egg.eggs.${memberMention.user.id}`);
            if(bio == null) bio = "No bio set";
            if(count == null) count = 0;
            if(eggs == null) eggs = 10;

            let embed = new Discord.RichEmbed()
            .setThumbnail(memberMention.user.displayAvatarURL)
            .addField("User", memberMention.user.tag, true)
            .addField("Eggs", `🥚 ${eggs}`, true)
            .addField("Bio", bio)
            .setColor(invisible)
            .setFooter(`${count} posts`)
            .setTimestamp();
            return loadingM.edit(embed);
        }
    },
};