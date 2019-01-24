// Initialize environment variables from .env file
require('dotenv').config();
import "reflect-metadata";

import express      from 'express';
import bodyParser   from 'body-parser';
import path         from 'path';
import { execSync } from 'child_process';

import { Client }   from 'eris';
import { SteamAPI } from './API/SteamAPI';
import { Paperbot } from './Paperbot';
import { Database } from './Database';

import { ApolloServer } from 'apollo-server-express';
import schema           from './GraphQL/Schema'
// import { typeDefs, resolvers } from './GraphQL/Schema';

const db = Database.Instance;
const discord = new Client(process.env.DISCORD_BOT_TOKEN);
const paperbot = new Paperbot(discord, db);


/*
*
* Express server
*
*/
const server = new ApolloServer({schema});
const app = express();
app.use(bodyParser.json());
app.use(express.static('dist'));
server.applyMiddleware({app});

/*
app.get('/', (request, response) => {
    console.log(__dirname, path.join(__dirname, '../dist/index.html'));
    response.sendFile(path.join(__dirname, '../dist/index.html'))
});
*/

// DEBUG
if (process.env.NODE_ENV === "development") {
    app.get('/allGames', async (request, response) => {
        response.send(await SteamAPI.Instance.getAllGames())
    });

    app.get('/getGame', async (request, response) => {
        const appId = request.query.appId; // default appId: Half-Life 2
        response.send(await SteamAPI.Instance.getGameInfo(appId ? appId : 220));
    });
}
// END DEBUG

// Redirect other requests to React Router

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../../dist/index.html'))
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
    const output = execSync(
        `git checkout -- ./ && git pull -X theirs ${repoUrl} glitch && refresh`
    ).toString();

    response.status(200).send()
});


const listener = app.listen(process.env.PORT ? process.env.PORT : 3030, () => {
    console.log(`Your app is listening on port ${(<any>listener.address()).port} ${server.graphqlPath}`);
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
const steamAPI = SteamAPI.Instance;



