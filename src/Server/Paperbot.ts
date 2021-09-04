import { Artwork, Game, Screenshot } from '@igdb/types'
import {
  Client as DiscordClient,
  Message,
  MessageEmbed,
  VoiceConnection,
} from 'discord.js'

import { SteamAPI } from './API/SteamAPI'
import * as commands from './Commands/index'
import { BoraInsults } from './Data/BoraInsults'
import { UserID } from './Data/User'
import { FaunaClient, UserData } from './DB/FaunaClient'
import { Bussen } from './Games/Bussen/Bussen'
import { IGDB } from './index'
import { getRandomElement, ifArrayGetFirstItem } from './utils'

interface Clients {
  discord: DiscordClient
  fauna: FaunaClient
  igdb: IGDB
  steam: SteamAPI
}

export class Paperbot {
  discord: DiscordClient
  steam: SteamAPI
  igdb: IGDB
  fauna: FaunaClient
  games: Bussen[] = []
  boraIsGay = false
  timer: NodeJS.Timeout
  prefixMap: Map<string, string> = new Map()

  constructor({ discord, fauna, igdb, steam }: Clients) {
    this.discord = discord
    this.steam = steam
    this.igdb = igdb
    this.fauna = fauna

    this.messageHandler = this.messageHandler.bind(this)

    this.timer = setInterval(this.onTick, 60000)

    discord.on('message', this.messageHandler)
  }

  public onTick = async () => {
    const time = new Date()
    if (
      time.getDay() === 3 &&
      time.getHours() === 0 &&
      time.getMinutes() === 0
    ) {
      const channels = new Map()
      const connections: VoiceConnection[] = []
      for (const [, guild] of this.discord.guilds.cache) {
        const members = await guild.members.fetch()
        for (const [, member] of members) {
          if (
            member?.voice?.channel &&
            !channels.has(member.voice.channel.id)
          ) {
            channels.set(member.voice.channel.id, true)
            const connection = await member.voice?.channel?.join()
            if (connection) connections.push(connection)
          }
        }
      }

      connections.map(c => {
        const dispatcher = c.play('./assets/audio/itiswednesday.mp3')
        dispatcher.on('finish', () => {
          dispatcher.destroy()
          c.disconnect()
        })
      })
    }
  }

  public onUserCreated = async (userData: Partial<UserData>) => {
    const user = await this.discord.users.fetch(userData.id)
    const dm = await user.dmChannel.fetch()

    dm.messages.channel.lastMessage.edit(
      `User was successfully created as ${userData.userName}`,
      {},
    )
  }

  private async messageHandler(msg: Message): Promise<void> {
    if (msg.author.bot) return
    let prefix = this.prefixMap.get(msg.guild?.id)

    if (!prefix && msg.guild) {
      const settings = await this.fauna.getGuildSettings(msg.guild.id)
      prefix = settings?.prefix || '!'
      this.prefixMap.set(msg.guild.id, prefix)
    } else if (prefix === undefined) {
      prefix = '!'
    }

    Object.keys(commands).some(key => {
      const command = commands[key as keyof typeof commands]
      if (command.matcher.bind(this)(prefix, msg)) {
        console.log(`'${msg.content}' matched command '${key}'`)
        const parameters = command.parameterMatcher
          ? command.parameterMatcher(msg.content)
          : msg.content.match(/([^ ])+/gi)
        command.fn.bind(this)(prefix, msg, parameters)
        return command.stopPropagation
      }
    })

    if (msg.content.startsWith('!no_u')) {
      const content = new MessageEmbed()
        .setDescription('no u')
        .attachFiles(['./assets/imgs/no_u.jpg'])
      msg.channel.send(content)
    }

    if (msg.content.startsWith('!bora_is_gay')) {
      if (msg.author.tag === UserID.Aldert) {
        if (!this.boraIsGay) {
          this.discord.on('message', (message: Message) => {
            if (message.author.username === 'BoraEF') {
              message.reply(getRandomElement(BoraInsults))
              // this.fauna.writeToStats(message.author.id, msg.guild.id, {
              //   boraIsGay: 1,
              // })
            }
          })
          msg.reply('`Bora is gay mode activated`')
        } else {
          // this.discord.off('message')
          msg.reply('`Bora is gay mode deactivated`')
        }
        this.boraIsGay = !this.boraIsGay
      }
    }

    if (msg.content.startsWith('!g ')) {
      const name = msg.content.match(/g (.+)/)[1]
      try {
        const response = await this.igdb
          .fields('*,artworks.*,screenshots.*')
          .search(name)
          .request('/games')

        response.data.forEach((game: Game) => {
          const { artworks, name, screenshots, summary } = game
          const artwork =
            ifArrayGetFirstItem(artworks as Artwork[])?.url ||
            ifArrayGetFirstItem(screenshots as Screenshot[])?.url

          const message = new MessageEmbed()
            .setTitle(name)
            .setDescription(summary)
            .setThumbnail(artwork ? `https:${artwork}` : undefined)

          msg.channel.send(message)
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
