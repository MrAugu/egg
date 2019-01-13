const Discord = require("discord.js");
const ms = require("parse-ms"); // eslint-disable-line no-unused-vars
const { loading } = require("../data/emojis.json");
const { invisible } = require("../data/colors.json");
const { logs } = require("../data/channels.json"); // eslint-disable-line no-unused-vars
const { mods } = require("../settings.json");
const prePosts = require("../models/pre-post.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "list",
  description: "Posts that need approval",
  cooldown: "5",
  aliases: [],
  async execute (client, message, args) {
    if (!mods.includes(message.author.id)) return message.channel.send("You don't have permission to check list of pending posts.");
    const msg = await message.channel.send(`${loading} Fetching unapproved posts...`);

    if (!args[0]) {
      
      prePosts.find({
        serverID: message.guild.id
      }).sort([
        ["id", "descending"]
      ]).exec((err, res) => {
        if (err) console.log(err);

        const unapprovedIDs = [];

        for (const i of res) {
          unapprovedIDs.push(`${i[1].id}`);
        }

        let listEmbed = new Discord.RichEmbed() // eslint-disable-line prefer-const
          .setTitle("List of Pending Posts")
          .addField("Stats:", `Currently ${prePosts.countDocuments().toLocaleString()} posts awaiting approval.`)
          .setColor(invisible);
        listEmbed.addField("Unapproved posts:", `\`\`\`${unapprovedIDs.join(", ")}\`\`\``);
        return msg.edit(listEmbed);
      });


    } else if (args[0]) {
      prePosts.findOne({ 
        id: args[0]
      }, async (err, post) => {
        if (err) console.log(err);

        if (!post) return message.channel.send("Couldn't find any post with id `#" + args[0] + "`.");

        const showEmbed = new Discord.RichEmbed()
          .setTitle(`Post #${post.id}`)
          .setImage(post.url)
          .setColor(invisible)
          .setTimestamp();
        
        return msg.edit(showEmbed);
      });
    }
  },
};