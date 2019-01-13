const { downloading, approved } = require("../data/emojis.json");
const { logs } = require("../data/channels.json");
const { mods } = require("../settings.json");
const prePosts = require("../models/pre-post.js");
const Meme = require("../models/post.js");
const mongoose = require("mongoose");
const mongoUrl = require("./tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "approve",
  description: "Approve a post",
  usage: "<id>",
  cooldown: "5",
  aliases: ["a"],
  async execute (client, message, args) {
    if (!mods.includes(message.author.id)) return message.channel.send("You don't have requiered permissions to approve posts.");

    prePosts.findOne({
      id: args[0]
    }, async (err, post) => {
      if (err) console.log(err);

      if (!post) return message.channel.send("Couldn't find any post matching that id.");

      const msg = await message.channel.send(`${downloading} Approving post...`);
      prePosts.findOneAndDelete({ id: post.id }, (err, x) => console.log(err)); // eslint-disable-line no-unused-vars

      const newPost = new Meme({
        id: post.id,
        authorID: post.authorID,
        uploadedAt: post.uploadedAt,
        url: post.url,
        upVotes: 0,
        downVotes: 0,
        approvedBy: message.author.id
      });

      newPost.save().catch(e => console.log(e));

      msg.edit(approved + " Approvd the post with id `#" + post.id + "`.");

      const u = await client.fetchUser(post.authorID);

      client.channels.get(logs).send(`${approved} Post \`#${post.id}\` by **${u.tag}** (ID: ${u.id}) has been approved by **${message.author.tag}** (ID: ${message.author.id}).`);

      try {
        u.send(`${approved} Your post with id \`#${post.id}\` has been approved by **${message.author.tag}**.`);
      } catch (e) {
        return;
      }
    });
  },
};