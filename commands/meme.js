const Discord = require('discord.js');
const db = require('quick.db');
const ms = require(`parse-ms`);
const { invisible } = require('../data/colors.json');
const { loading, upvote, downvote } = require('../data/emojis.json');

module.exports = {
    name: 'meme',
    description: 'Displays a meme,',
    cooldown: `5`,
    usage: `<id of post>`,
    async execute(client, message, args) {
        try{
            const loadingM = await message.channel.send(`${loading} Fetching database...`);
            if(!args[0]){
                const arrLength = await db.fetch(`egg.image.length`);
                let id = null;
                let randomIndex;
                while(id == null){
                    randomIndex = Math.floor((Math.random() * arrLength) + 0);
                    id = await db.fetch(`egg.id[${randomIndex}]`);
                }
                const image = await db.fetch(`egg.image[${randomIndex}]`);
                const user = await db.fetch(`egg.author[${randomIndex}]`);
                const userID = await db.fetch(`egg.authorID[${randomIndex}]`);
                const avatar = await db.fetch(`egg.avatar[${randomIndex}]`);
                const upvotes = await db.fetch(`egg.upvotes[${randomIndex}]`);
                const downvotes = await db.fetch(`egg.downvotes[${randomIndex}]`);
                const postedTime = await db.fetch(`egg.time[${randomIndex}]`);
                const votes = upvotes-downvotes;
    
                let timeObj = ms(Date.now() - postedTime);
                let time;
                if(timeObj.days == 0){
                    if(timeObj.hours == 0){
                        if(timeObj.minutes == 0){
                            time = timeObj.seconds + " second(s)";
                        } else {
                            time = timeObj.minutes + " minute(s)";
                        }
                    } else {
                        time = timeObj.hours + " hour(s)";
                    }
                } else {
                    time = timeObj.days + " day(s)";
                }
                const embed = new Discord.RichEmbed()
                .setAuthor(`${votes} Vote(s)`)
                .setImage(image)
                .setFooter(`#${id}  Posted by ${user} ${time} ago`, avatar)
                .setColor(invisible);
    
                await loadingM.edit(embed)
                .then(function () {
                    loadingM.react("⬆");
                    loadingM.react("⬇");
                });
    
                const filter = (reaction) => reaction.emoji.name === `⬆`;
                const collector = loadingM.createReactionCollector(filter, { time: 60000 });
                collector.on('collect', r => {
                    console.log(`Collected ${r.emoji.name}`);
                    db.add(`egg.upvotes[${randomIndex}]`, 1);
                });
                collector.on('end', collected => {console.log(`Collected ${collected.size} items`)});
    
                const filter2 = (reaction) => reaction.emoji.name === `⬇`;
                const collector2 = loadingM.createReactionCollector(filter2, { time: 60000 });
                collector2.on('collect', r => {
                    console.log(`Collected ${r.emoji.name}`);
                    db.add(`egg.downvotes[${randomIndex}]`, 1);
                });
                collector2.on('end', collected => {console.log(`Collected ${collected.size} items`)});
                db.subtract(`egg.upvotes[${randomIndex}]`, 1);
                db.subtract(`egg.downvotes[${randomIndex}]`, 1);
                const updatedUpvotes = await db.fetch(`egg.upvotes[${randomIndex}]`);
                const m = (upvotes-updatedUpvotes)*10;
                db.add(`egg.eggs.${userID}`, m)
            } //else {
            //     if(isNaN(args[0])) return message.channel.send(`Not a valid number.`)
            //     const total = await db.fetch(`egg.totalPosts`);
            //     if(args[0] > total || args[0] < 0) return loadingM.edit(`That id does not exist!`);
            //     let i = args[0]-1;  
        
            //     const id = await db.fetch(`egg.id[${i}]`);
            //     const image = await db.fetch(`egg.image[${i}]`);
            //     const user = await db.fetch(`egg.author[${i}]`);
            //     const userID = await db.fetch(`egg.authorID[${i}]`);
            //     const avatar = await db.fetch(`egg.avatar[${i}]`);
            //     const upvotes = await db.fetch(`egg.upvotes[${i}]`);
            //     const downvotes = await db.fetch(`egg.downvotes[${i}]`);
            //     const postedTime = await db.fetch(`egg.time[${i}]`);
            //     const votes = upvotes-downvotes;
        
            //     let timeObj = ms(Date.now() - postedTime);
            //     let time;
            //     if(timeObj.days == 0){
            //         if(timeObj.hours == 0){
            //             if(timeObj.minutes == 0){
            //                 time = timeObj.seconds + " second(s)";
            //             } else {
            //                 time = timeObj.minutes + " minute(s)";
            //             }
            //         } else {
            //             time = timeObj.hours + " hour(s)";
            //         }
            //     } else {
            //         time = timeObj.days + " day(s)";
            //     }
            //     const embed = new Discord.RichEmbed()
            //     .setAuthor(`${votes} Vote(s)`)
            //     .setImage(image)
            //     .setFooter(`#${id}  Posted by ${user} ${time} ago`, avatar)
            //     .setColor(invisible);
        
            //     await loadingM.edit(embed)
            //     .then(function () {
            //         loadingM.react("⬆");
            //         loadingM.react("⬇");
            //     });
        
            //     const filter = (reaction) => reaction.emoji.name === `⬆`;
            //     const collector = loadingM.createReactionCollector(filter, { time: 60000 });
            //     collector.on('collect', r => {
            //         console.log(`Collected ${r.emoji.name}`);
            //         db.add(`egg.upvotes[${i}]`, 1);
            //     });
            //     collector.on('end', collected => {console.log(`Collected ${collected.size} items`)});
        
            //     const filter2 = (reaction) => reaction.emoji.name === `⬇`;
            //     const collector2 = loadingM.createReactionCollector(filter2, { time: 60000 });
            //     collector2.on('collect', r => {
            //         console.log(`Collected ${r.emoji.name}`);
            //         db.add(`egg.downvotes[${i}]`, 1);
            //     });
            //     collector2.on('end', collected => {console.log(`Collected ${collected.size} items`)});
            //     db.subtract(`egg.upvotes[${i}]`, 1);
            //     db.subtract(`egg.downvotes[${i}]`, 1);
            //     const updatedUpvotes = await db.fetch(`egg.upvotes[${i}]`);
            //     const m = (upvotes-updatedUpvotes)*10;
            //     db.add(`egg.eggs.${userID}`, m)
            // }
        } catch(eror){
            console.log(erorr);
            message.channel.send(`Unexpected error! ${error}`)
        }
    },  
};