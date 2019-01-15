const Discord = require("discord.js");
const ms = require("parse-ms"); // eslint-disable-line no-unused-vars
const { invisible } = require("../data/colors.json");
const { loading, upvote, downvote } = require("../data/emojis.json"); // eslint-disable-line no-unused-vars
const Posts = require("../models/post.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "meme",
  description: "Displays a meme,",
  cooldown: "5",
  usage: "<id of post>",
  async execute (client, message, args) {
    try {
      const msg = await message.channel.send(`${loading} Fetching meme...`);

      if (!args[0]) {
        const count = await Posts.countDocuments();
        let memeIndex = Math.floor((Math.random() * count));
        if (memeIndex === 0) memeIndex = 1;

        Posts.findOne({
          id: memeIndex
        }, async (err, meme) => {
          if (err) console.log(err);

          if (!meme) return msg.edit("This image has been deleted. Please try again.");
          
          const u = await client.fetchUser(meme.authorID);

          const memEmbed = new Discord.RichEmbed()
            .setTitle(`Post #${meme.id}`)
            .setDescription(`${upvote} ${meme.upVotes}\n${downvote} ${meme.downVotes}`)
            .setImage(meme.url)
            .setColor(invisible)
            .setFooter(`Posted by ${u.tag}.`, u.displayAvatarURL)
            .setTimestamp();
          msg.edit(memEmbed);

          const filter = (r) => r.emoji.name === "⬆" || r.emoji.name === "⬇";
          const collector = msg.createReactionCollector(filter, { time: 60000 });

          collector.on("collect", r => {
            if (r.emoji.name === "⬆") {
              meme.upVotes = meme.upVotes + 1;
            } else if (r.emoji.name === "⬇") {
              meme.downVotes = meme.downVotes + 1;
            }
          });

          collector.on("end", c => meme.save().catch(e => console.log(e))); // eslint-disable-line no-unused-vars          
        });
      } else if (args[0]) {
        const memeIndex = args[0];

        Posts.findOne({
          id: memeIndex
        }, async (err, meme) => {
          if (err) console.log(err);

          if (!meme) return msg.edit("This image has been deleted. Please try again.");
          
          const u = await client.fetchUser(meme.authorID);

          const memEmbed = new Discord.RichEmbed()
            .setTitle(`Post #${meme.id}`)
            .setDescription(`${upvote} ${meme.upVotes}\n${downvote} ${meme.downVotes}`)
            .setImage(meme.url)
            .setColor(invisible)
            .setFooter(`Posted by ${u.tag}.`, u.displayAvatarURL)
            .setTimestamp();
          msg.edit(memEmbed);

          const filter = (r) => r.emoji.name === "⬆" || r.emoji.name === "⬇";
          const collector = msg.createReactionCollector(filter, { time: 60000 });

          collector.on("collect", r => {
            if (r.emoji.name === "⬆") {
              meme.upVotes = meme.upVotes + 1;
            } else if (r.emoji.name === "⬇") {
              meme.downVotes = meme.downVotes + 1;
            }
          });

          collector.on("end", c => meme.save().catch(e => console.log(e))); // eslint-disable-line no-unused-vars          
        });
      }
      
    } catch (error) {
      console.log(error);
      message.channel.send(`Unexpected error! ${error}`);
    }
  },  
};