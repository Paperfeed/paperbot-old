import { GameResult } from '@igdb/types'
import { Client as DiscordClient, Message, MessageReaction } from 'discord.js'

import { SteamAPI } from './API/SteamAPI'
import * as commands from './Commands/index'
import { FaunaClient } from './DB/FaunaClient'
import { IGDB } from './index'

enum Step {
  REGISTRATION_CONFIRM_NAME,
}

interface StackItem {
  step: Step
  userId: string
}

interface Clients {
  discord: DiscordClient
  fauna: FaunaClient
  igdb: IGDB
  steam: SteamAPI
}

export class Paperbot {
  historyStack: Array<StackItem>
  discord: DiscordClient
  steam: SteamAPI
  igdb: IGDB
  fauna: FaunaClient

  constructor({ discord, fauna, igdb, steam }: Clients) {
    this.discord = discord
    this.steam = steam
    this.igdb = igdb
    this.historyStack = []
    this.fauna = fauna
    this.messageHandler = this.messageHandler.bind(this)
    this.messageReactionHandler = this.messageReactionHandler.bind(this)

    discord.on('message', this.messageHandler)
    discord.on('messageReactionAdd', this.messageReactionHandler)
  }

  private async messageReactionHandler(
    msgReaction: MessageReaction,
  ): Promise<void> {
    msgReaction
  }

  private async messageHandler(msg: Message): Promise<void> {
    if (msg.author.bot) return

    const unresolvedActions = this.historyStack.filter(
      a => a.userId === msg.member.id,
    )

    if (unresolvedActions.length) {
      console.log(
        "Found unresolved action for this message's userId",
        unresolvedActions,
      )

      for (const action of unresolvedActions) {
        switch (action.step) {
          case Step.REGISTRATION_CONFIRM_NAME:
            if (/\b(yes|y|ye|yeah|ok)\b/i.test(msg.content)) {
              // Code to add new user here
            }
            break
        }

        this.historyStack = this.historyStack.filter(a => a !== action)
      }
    }

    console.log(`Received message: ${msg.content}`)

    Object.keys(commands).some(key => {
      const command = commands[key]
      if (command.matcher(msg)) {
        console.log(`which matched command [${key}]`)
        command.fn.bind(this)(msg)
        return command.stopPropagation
      }
    })

    if (msg.content.startsWith('g ')) {
      const name = msg.content.match(/g (.+)/)[1]
      try {
        const response = await this.igdb
          .fields('*')
          .search(name)
          .request('/games')
        response.data.forEach((game: GameResult) =>
          msg.channel.send(JSON.stringify(game, null, 2)),
        )
      } catch (e) {
        console.error(e)
      }
    }
  }
}
