// Initialize environment variables from .env file
import { Paperbot } from './Paperbot'

require('dotenv').config()
import 'reflect-metadata'

import { execSync } from 'child_process'
import Discord from 'discord.js'
import fastify from 'fastify'
import IGDB from 'igdb-api-node'
import fetch from 'node-fetch'
import SteamAPI from 'type-steamapi'

import { FaunaClient } from './DB/FaunaClient'
import { fetchAsync } from './utils'

export type IGDB = ReturnType<typeof IGDB>

const {
  DISCORD_BOT_TOKEN,
  IGDB_CLIENT_ID,
  IGDB_SECRET,
  NODE_ENV,
  STEAM_API_HOST,
  STEAM_API_KEY,
  WEBHOOK_SECRET,
} = process.env

const steam = new SteamAPI({ apiKey: STEAM_API_KEY })
const discord = new Discord.Client()

const fetchIGDBToken = async (): Promise<{
  access_token: string
  expires_in: number
  token_type: string
}> => {
  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_SECRET}&grant_type=client_credentials`,
      {
        method: 'POST',
      },
    )

    return await response.json()
  } catch (e) {
    console.error('Could not retrieve IGDB access token', e)
  }
}

interface QueryString {
  appId: string
  secret: string
}

interface Request {
  Body: any
  Headers: any
  Params: any
  Querystring: QueryString
}

fetchIGDBToken().then(token => {
  const igdb = IGDB(IGDB_CLIENT_ID, token.access_token)
  const fauna = new FaunaClient()

  /*
   *
   * Server
   *
   */
  const app = fastify()

  // Endpoints
  if (NODE_ENV === 'development') {
    app.get('/allGames', async (request, response) => {
      const data = await fetchAsync<{ applist: { apps: unknown[] } }>(
        `${STEAM_API_HOST}/ISteamApps/GetAppList/v2/`,
      )
      response.send(data ? data.applist.apps : 'No data retrieved')
    })

    app.get<Request>('/getGame', async (request, response) => {
      const appId = request.query.appId // default appId: Half-Life 2
      response.send(await steam.getAppDetails((appId as string) || '220'))
    })
  }

  app.post<Request>('/deploy', (request, response) => {
    if (request.query.secret !== WEBHOOK_SECRET) {
      response.status(401).send()
      return
    }

    if (request.body.ref !== 'refs/heads/glitch') {
      response
        .status(200)
        .send('Push was not to glitch branch, so did not deploy.')
      return
    }

    const repoUrl = request.body.repository.git_url

    console.log('Fetching latest changes.')
    execSync(
      `git checkout -- ./ && git pull -X theirs ${repoUrl} glitch && refresh`,
    ).toString()

    response.status(200).send()
  })

  app.listen(3000, () => {
    console.log(`Listening on port 3000`)
  })

  /*
   *
   * Discord bot
   *
   */
  discord.on('ready', () => {
    new Paperbot({ discord, fauna, igdb, steam })
    console.log('Bot ready!')
  })

  discord.login(DISCORD_BOT_TOKEN)
})
