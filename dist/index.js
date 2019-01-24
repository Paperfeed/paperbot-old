"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Initialize environment variables from .env file
require('dotenv').config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const eris_1 = require("eris");
const SteamAPI_1 = require("./API/SteamAPI");
const Paperbot_1 = require("./Paperbot");
const Database_1 = require("./Database");
const apollo_server_express_1 = require("apollo-server-express");
const Schema_1 = __importDefault(require("./GraphQL/Schema"));
// import { typeDefs, resolvers } from './GraphQL/Schema';
const db = Database_1.Database.Instance;
const discord = new eris_1.Client(process.env.DISCORD_BOT_TOKEN);
const paperbot = new Paperbot_1.Paperbot(discord, db);
/*
*
* Express server
*
*/
const server = new apollo_server_express_1.ApolloServer({ schema: Schema_1.default });
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(express_1.default.static('dist'));
server.applyMiddleware({ app });
/*
app.get('/', (request, response) => {
    console.log(__dirname, path.join(__dirname, '../dist/index.html'));
    response.sendFile(path.join(__dirname, '../dist/index.html'))
});
*/
// DEBUG
if (process.env.NODE_ENV === "development") {
    app.get('/allGames', (request, response) => __awaiter(this, void 0, void 0, function* () {
        response.send(yield SteamAPI_1.SteamAPI.Instance.getAllGames());
    }));
    app.get('/getGame', (request, response) => __awaiter(this, void 0, void 0, function* () {
        const appId = request.query.appId; // default appId: Half-Life 2
        response.send(yield SteamAPI_1.SteamAPI.Instance.getGameInfo(appId ? appId : 220));
    }));
}
// END DEBUG
// Redirect other requests to React Router
app.get('*', (request, response) => {
    response.sendFile(path_1.default.join(__dirname, '../../dist/index.html'));
});
app.post('/deploy', (request, response) => {
    if (request.query.secret !== process.env.WEBHOOK_SECRET) {
        response.status(401).send();
        return;
    }
    if (request.body.ref !== 'refs/heads/glitch') {
        response.status(200).send('Push was not to glitch branch, so did not deploy.');
        return;
    }
    const repoUrl = request.body.repository.git_url;
    console.log('Fetching latest changes.');
    const output = child_process_1.execSync(`git checkout -- ./ && git pull -X theirs ${repoUrl} glitch && refresh`).toString();
    response.status(200).send();
});
const listener = app.listen(process.env.PORT ? process.env.PORT : 3030, () => {
    console.log(`Your app is listening on port ${listener.address().port} ${server.graphqlPath}`);
});
/*
*
* Discord bot
*
 */
discord.on('ready', () => {
    console.log('Bot ready!');
});
discord.on('messageCreate', (msg) => paperbot.messageHandler(msg));
discord.connect().catch(e => console.log("Error connecting bot to Discord: ", e));
// Instantiate SteamAPI
const steamAPI = SteamAPI_1.SteamAPI.Instance;
//# sourceMappingURL=index.js.map