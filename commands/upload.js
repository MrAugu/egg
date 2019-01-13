const Discord = require("discord.js");
const validUrl = require("valid-url");
const { downloading, loading } = require("../data/emojis.json");
const { invisible } = require("../data/colors.json");
const { posts } = require("../data/channels.json");
const prePost = require("../models/pre-post.js");
const mongoose = require("mongoose");
const mongoUrl = require("./tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "upload",
  description: "Uploads your meme to the database",
  usage: "<image>",
  cooldown: "120",
  async execute (client, message, args) {
    const downloadingM = await message.channel.send(`${downloading} Uploading to database...`);

    try {
      let img;
      if (!args[0]) {
        img = message.attachments.first().url;
        if (!img) return downloadingM.edit(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`egg upload <image>\``);
      } else if (validUrl.isUri(args[0])) {
        img = args[0];
      } else {
        return downloadingM.edit(`That was not a valid url ${message.author}.\nCorrect Usage: \`egg upload <image>\``);
      }

      const id = prePost.countDocuments() + 1;

      const post = new prePost({
        id: id,
        authorID: message.author.id,
        uploadedAt: message.createdTimestamp,
        url: img
      });
    
      await post.save().catch(e => console.log(e));
      downloadingM.edit(`Successfully uploaded image to database!\n${loading} Waiting for approval from one of our moderators/administrators. (This system is to make sure images follows our guidelines.)`);

      const embed = new Discord.RichEmbed()
        .setAuthor(`Posted by: ${message.author.tag} (ID: ${message.author.id})`, message.author.displayAvatar)
        .setDescription(`ID Number: ${id}`)
        .setImage(img)
        .setColor(invisible)
        .setFooter("Awaiting for approval.")
        .setTimestamp();
      client.channels.get(posts).send(embed);
    } catch (error) {
      console.log(error);
      downloadingM.edit("An error occured while uploading image to database! Please make sure you are uploading an image/gif/video, and not something else.");
    }
  },
};