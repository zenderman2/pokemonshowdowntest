require('dotenv/config');
const { Client, GatewayIntentBits } = require('discord.js');
const { CommandKit } = require('commandkit');

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    bulkRegister: true
});

client.login(process.env.BOT_TOKEN);
