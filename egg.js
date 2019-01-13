const fs = require('fs');
const Discord = require('discord.js');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

const tokens = require('./tokens.json'),
    settings = require('./settings.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const log = message => {console.log(`[${new Date().toLocaleString()}] - ${message}`);};


const init = async () => {
    for(const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
        
    const evtFiles = await readdir("./events/");
    log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);

        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
};
init();

client.on("disconnect", () => client.logger.warn("Disconnecting..."));
client.on("reconnecting", () => client.logger.log("Reconnecting...", "log"));
client.on("error", e => client.logger.error(e));
client.on("warn", w => client.logger.warn(w));

client.login(tokens.token);
