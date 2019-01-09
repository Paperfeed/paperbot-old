"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Initialize environment variables from .env file
require('dotenv').config();
require("reflect-metadata");
const eris_1 = require("eris");
const SteamAPI_1 = require("./API/SteamAPI");
const Paperbot_1 = require("./Paperbot");
const Database_1 = require("./Database");
const db = Database_1.Database.Instance;
const discord = new eris_1.Client(process.env.DISCORD_BOT_TOKEN);
const paperbot = new Paperbot_1.Paperbot(discord, db);
discord.on('ready', () => {
    console.log('Bot ready!');
});
discord.on('messageCreate', (msg) => paperbot.messageHandler(msg));
discord.connect();
const steamAPI = SteamAPI_1.SteamAPI.Instance;
//# sourceMappingURL=index.js.map