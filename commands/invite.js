module.exports = {
    name: 'invite',
    description: 'Invite link for the bot',
    async execute(client, message, args) {
        return message.channel.send("Invite me here: https://discordapp.com/oauth2/authorize?client_id=530766901282996224&scope=bot&permissions=338952")
    },  
};