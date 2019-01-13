const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { downloading, rejected } = require("../data/emojis.json");
const { logs } = require("../data/channels.json");
const { mods } = require("../settings.json");
const prePosts = require("../models/pre-post.js");
const denyal = require("../models/denyedPosts.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "reject",
  description: "reject a post",
  usage: "<id> <reason>",
  args: "true",
  cooldown: "5",
  aliases: ["r"],
  async execute (client, message, args) {
    if (!mods.includes(message.author.id)) return message.channel.send("You don't have requiered permissions to reject posts.");

    const reason = args.slice(1).join(" ");
    if (!reason) return message.channel.send("You have to specify a reason for rejection.");

    prePosts.findOne({
      id: args[0]
    }, async (err, post) => {
      if (err) console.log(err);

      if (!post) return message.channel.send("Couldn't find any post matching that id.");

      const msg = await message.channel.send(`${downloading} Rejecting post...`);
      prePosts.findOneAndDelete({ id: post.id }, (err, x) => console.log(err)); // eslint-disable-line no-unused-vars

      const newPost = new denyal({
        id: post.id,
        authorID: post.authorID,
        uploadedAt: post.uploadedAt,
        url: post.url,
        rejectedBy: message.author.id,
        reason: reason
      });

      newPost.save().catch(e => console.log(e));

      msg.edit(rejected + " Rejected the post with id `#" + post.id + "`.");

      const u = await client.fetchUser(post.authorID);

      client.channels.get(logs).send(`${rejected} Post \`#${post.id}\` by **${u.tag}** (ID: ${u.id}) has been approved by **${message.author.tag}** (ID: ${message.author.id}) for the reason: ${reason}`);

      try {
        u.send(`${rejected} Your post with id \`#${post.id}\` has been rejected by **${message.author.tag}** for the reason: ${reason}`);
      } catch (e) {
        return;
      }
    });
  },
};