const Discord = require("discord.js");
const { invisible } = require("../data/colors.json");
const { loading } = require("../data/emojis.json");
const Profiles = require("../models.profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "profile",
  description: "Displays the user's profile",
  usage: "<user>",
  async execute (client, message, args) {
    const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;

    if (!user) return message.channel.send("Error! No target or message author detected.");

    const msg = await message.channel.send(`${loading} Loading profile...`);

    Profiles.findOne({
      authorID: user.id
    }, async (err, u) => {
      if (err) console.log(err);

      if (!u) {
        const newUser = new Profiles({
          authorID: user.id,
          eggs: 0,
          bio: "I'm a very mysterious person.",
          totalPosts: 0
        });

        await newUser.save().catch(e => console.log(e));
        
        const showoofEmbed = new Discord.RichEmbed()
          .setTitle(`Profile for ${user.user.tag}:`)
          .setThumbnail(user.user.displayAvatarURL)
          .addField("User Tag:", `${user.user.tag}`)
          .addField("Total Eggs:", "0")
          .addField("Bio:", "I'm a very mysterious person.")
          .addField("Total Posts:", "0")
          .setColor(invisible)
          .setTimestamp();
        return msg.edit(showoofEmbed);
      }

      const showEmbed = new Discord.RichEmbed()
        .setTitle(`Profile for ${user.user.tag}:`)
        .setThumbnail(user.user.displayAvatarURL)
        .addField("User Tag:", `${user.user.tag}`)
        .addField("Total Eggs:", u.eggs)
        .addField("Bio:", u.bio)
        .addField("Total Posts:", u.totalPosts)
        .setColor(invisible)
        .setTimestamp();
      return msg.edit(showEmbed);

    });
  },
};