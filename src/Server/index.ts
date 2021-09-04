// Initialize environment variables from .env file
import { Paperbot } from './Paperbot'

require('dotenv').config()
import 'reflect-metadata'

import { execSync } from 'child_process'
import Discord, { Intents } from 'discord.js'
import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import IGDB from 'igdb-api-node'
import fetch from 'node-fetch'
import path from 'path'
import { Readable } from 'stream'

import { SteamAPI } from './API/SteamAPI'
import { FaunaClient } from './DB/FaunaClient'
import { createDeck, drawCards } from './Games/Functional/Deck'
import { PokerState } from './Games/Poker/Poker'
import { renderPokerTable } from './Games/Poker/PokerCanvas'

export type IGDB = ReturnType<typeof IGDB>

const {
  DISCORD_BOT_TOKEN,
  IGDB_CLIENT_ID,
  IGDB_SECRET,
  NODE_ENV,
  WEBHOOK_SECRET,
} = process.env

global.appRoot = path.join(path.resolve(__dirname), '../../')

const intents = new Intents(Intents.ALL).remove(
  'GUILD_BANS',
  'GUILD_INVITES',
  'GUILD_WEBHOOKS',
)
// console.log(intents.toArray())

const discord = new Discord.Client({ ws: { intents } })

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
  userId: string
}

interface Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Body: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Headers: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Params: any
  Querystring: QueryString
}

fetchIGDBToken().then(async token => {
  const igdb = IGDB(IGDB_CLIENT_ID, token.access_token)
  const fauna = new FaunaClient()
  const steam = new SteamAPI()
  const paperBot = new Paperbot({ discord, fauna, igdb, steam })

  /**
   * Server
   */
  const server = fastify()
  server.register(fastifyStatic, {
    prefix: '/assets/',
    root: path.join(global.appRoot, '/assets'),
  })

  // Debug Endpoints
  if (NODE_ENV === 'development') {
    server.get('/allGames', async (request, response) => {
      response.send((await steam.getAllGames()) ?? 'No data retrieved')
    })

    server.get<Request>('/getGame', async (request, response) => {
      const appId = request.query.appId
      response.send(await steam.getGameInfo(appId || '220')) // default appId: Half-Life 2
    })

    server.get('/poker', async (request, response) => {
      const deck = createDeck()
      const cards = drawCards(deck, 5, { hideOnDraw: true })
      cards[0].flip()
      const state: PokerState = {
        cardsOnTable: cards,
        dealer: {
          avatar: '',
          bet: 0,
          cards: drawCards(deck, 2),
          cash: 1000,
          discord: {},
          id: 'dealer',
          name: 'Test 1',
          tag: 'tag1',
        },
        dealerIndex: 1,
        deck,
        players: [
          {
            avatar: '',
            bet: 0,
            cards: drawCards(deck, 2),
            cash: 1000,
            discord: {},
            id: 'player',
            name: 'Test 1',
            tag: 'tag1',
          },
          {
            avatar: '',
            bet: 0,
            cards: drawCards(deck, 2),
            cash: 1000,
            discord: {},
            id: 'dealer',
            name: 'Test 2',
            tag: 'tag1',
          },
          {
            avatar: '',
            bet: 12,
            cards: drawCards(deck, 2),
            cash: 1000,
            discord: {},
            id: '123',
            name: 'Test 3',
            tag: 'tag1',
          },
          {
            avatar: '',
            bet: 12,
            cards: drawCards(deck, 2),
            cash: 1000,
            discord: {},
            id: '123',
            name: 'Test 4',
            tag: 'tag1',
          },
          {
            avatar: '',
            bet: 12,
            cards: drawCards(deck, 2),
            cash: 1000,
            discord: {},
            id: '123',
            name: 'Test 5',
            tag: 'tag1',
          },
          {
            avatar: '',
            bet: 12,
            cards: drawCards(deck, 2),
            cash: 1000,
            discord: {},
            id: '123',
            name: 'Lange naam',
            tag: 'tag1',
          },
        ],
        round: 1,
      } as any

      // await foreplay(state)
      const buffer = await renderPokerTable(state, 'player')
      // const buffer = await renderPokerCards(drawCards(deck, 2), {
      //   label: 'Hole cards',
      // })
      const stream = new Readable({
        read() {
          this.push(buffer)
          this.push(null)
        },
      })
      response.type('image/png')
      response.send(stream)
    })
  }
  // END

  server.get<Request>('/auth/steam', async (request, response) => {
    const userId = request.query.userId

    if (!userId) return response.status(400).send('No userid found')
    const redirectUrl = await steam.Auth.getRedirectUrl(`userId=${userId}`)
    return response.redirect(redirectUrl)
  })

  server.get<Request>('/auth/steam/authenticate', async (request, response) => {
    try {
      const userId = request.query.userId
      const userFromDB = await fauna.findUser(userId).catch(() => null)
      const user = await steam.Auth.authenticate(request)

      const dbUser = await fauna.createOrUpdateUser({
        avatar: user.avatar,
        country: user.loccountrycode,
        creationDate: user.timecreated,
        id: userId,
        name: user.realname,
        steamId: user.steamid,
        userName: user.personaname,
      })

      if (!userFromDB) {
        paperBot.onUserCreated(dbUser)
      }

      response.status(200).redirect('Successfully logged in')
    } catch (error) {
      console.error(error)
      response.status(500).send(error)
    }
  })

  server.post<Request>('/deploy', (request, response) => {
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

  server.listen(3000, () => {
    console.log(`Listening on port 3000`)
  })

  /**
   * Discord Bot
   */
  discord.on('ready', () => {
    console.log('Bot ready!')
  })

  discord.login(DISCORD_BOT_TOKEN)
})
