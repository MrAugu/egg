const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { invisible } = require("../data/colors.json"); // eslint-disable-line no-unused-vars
const { loading } = require("../data/emojis.json");
const { devs } = require("../settings.json");
const Posts = require("../models/post.js");
const mongoose = require("mongoose");
const mongoUrl = require("./tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "remove",
  description: "Removes a post from the database",
  args: true,
  usage: "<id>",
  async execute (client, message, args) {
    if (!devs.includes(message.author.id)) return;

    const msg = await message.channel.send(`${loading} Removing post...`);
    Posts.findOne({
      id: args[0]
    }, async (err, p) => {
      if (!p) return msg.edit("Couldn't find any post with this id.");

      Posts.findOneAndDelete({ id: p.id });

      const u = await client.fetchUser(p.authorID);

      msg.edit("Deleted post from database.");

      try {
        u.send(`Damn! Seems like your post with id \`#${p.id}\` has been deleted by an Administrator.`);
      } catch (e) {
        return;
      }
    });
  },  
};