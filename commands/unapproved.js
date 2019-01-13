const Discord = require('discord.js');
const db = require('quick.db');
const ms = require(`parse-ms`);
const { loading } = require('../data/emojis.json');
const { invisible } = require('../data/colors.json');
const { logs } = require('../data/channels.json');
const { mods } = require('../settings.json');

module.exports = {
    name: 'unapproved',
    description: 'Posts that need approval',
    cooldown: '5',
    aliases: ['u'],
    async execute(client, message, args) {
        if(!mods.includes(message.author.id)) return;
        const loadingM = await message.channel.send(`${loading} Fetching unapproved posts...`);

        if(!args[0]){
            try {
                let id = await db.fetch(`egg.unapproved.id`);
    
                let unapprovedIDs = "Unapproved posts:\n";
                for(var i = 0; i < id.length; i++){
                    let status = await db.fetch(`egg.status[${i}]`)
                    if(status === "unapproved"){
                        let uids = await db.fetch(`egg.unapproved.id[${i}]`);
                        unapprovedIDs +=  uids + ", ";
                    }
                }
                return loadingM.edit(`\`\`\`${unapprovedIDs}\`\`\``)
            } catch(error){
                console.log(error);
                loadingM.edit(`An error occured while uploading image to database! Please make sure you are uploading an image, and not something else.`);
            }
        }

        if(args[0]){
            if(isNaN(args[0])) return loadingM.edit(`Not a valid number.`)
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
            .setAuthor(`Awaiting for approval`)
            .setImage(image)
            .setFooter(`#${id}  Posted by ${user} (${userID}) ${time} ago`, avatar)
            .setColor(invisible);
            return loadingM.edit(embed);
        }
    },
};