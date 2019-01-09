// Initialize environment variables from .env file
require('dotenv').config();
import "reflect-metadata";

import { Client }   from 'eris';
import { SteamAPI } from "./API/SteamAPI";
import { Paperbot } from './Paperbot';
import { Database } from './Database';

const db = Database.Instance;
const discord = new Client(process.env.DISCORD_BOT_TOKEN);
const paperbot = new Paperbot(discord, db);

discord.on('ready', () => {
    console.log('Bot ready!');
});

discord.on('messageCreate', (msg) => paperbot.messageHandler(msg));

discord.connect();

const steamAPI = SteamAPI.Instance;