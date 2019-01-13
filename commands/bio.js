const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { loading } = require("../data/emojis.json");
const Profiles = require("../models.profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("./tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "bio",
  description: "Sets the user's bio.",
  usage: "<description>",
  args: true,
  cooldown: "60",
  aliases: ["setbio", "set-bio", "bioset"],
  async execute (client, message, args) {
    if (args.join(" ").length < 2) return message.channel.send("Your bio must be at lest 2 chars length.");
    if (args.join(" ").length > 200) return message.channel.send("Bio must be less than 200 characters.");

    const loadingM = await message.channel.send(`${loading} Setting bio...`);

    Profiles.findOne({
      authorID: message.author.id
    }, async (err, user) => {
      if (err) console.log(err);

      if (!user) {
        const newUser = new Profiles({
          authorID: message.author.id,
          eggs: 0,
          bio: args.join(" ")
        });

        await newUser.save().catch(e => console.log(e));
        return loadingM.edit(`Succesfully setted your bio to \`${args.join(" ")}\``);
      }

      user.bio = args.join(" ");
      user.save().catch(e => console.log(e));
      return loadingM.edit(`Succesfully setted your bio to \`${args.join(" ")}\``);
    });
  },  
};