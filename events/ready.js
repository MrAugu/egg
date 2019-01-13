const Discord = require('discord.js');
const db = require('quick.db');
const { avatar, version } = require('../settings.json')
const { invisible } = require('../data/colors.json');
const { loading, typing } = require('../data/emojis.json');
const { ready } = require('../data/channels.json');

module.exports = class {
    constructor(client) {
      this.client = client;
    }

  async run() {
    console.log(`${this.client.user.username} is online. Running on ${this.client.guilds.size} servers`);
    this.client.channels.get(ready).send(`${this.client.user.username} has restarted. Running on \`${this.client.guilds.size}\` servers`)
    this.client.user.setActivity(`with eggs`);
  };
}
