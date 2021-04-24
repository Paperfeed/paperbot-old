import { Client as DiscordClient, Message, MessageReaction } from 'discord.js'
import SteamAPI from 'type-steamapi'

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

    async messageHandler(msg) {
        if (!msg.member.bot) {

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

            if (msg.content.startsWith('test')) {
                /*this.discord.getUser
                msg.member.user.id*/
            }

            if (msg.content.startsWith('!help')) {
                this.discord.createMessage(msg.channel.id,
                    "Type !register to register yourself with Paperbot, " +
                    "after which you can join in on game selection rounds"
                );
            }

            if (msg.content.startsWith('!register')) {
                const parameters = msg.content.match(/([^ ])+/gi);
                const username = parameters.length > 1 ? parameters[1] : msg.member.user.username;
                const steamid = await SteamAPI.Instance.getUserID(username);
                const summary = await SteamAPI.Instance.getUserSummary(steamid);
                console.log(parameters);

                this.discord.createMessage(msg.channel.id,
                    {
                        embed: {
                            title: "**Found the following user:**",
                            // description: "Found the following user:",
                            thumbnail: {
                                url: summary.avatarmedium
                            },
                            color: 0x008000,
                            url: summary.profileurl,
                            fields: [
                                {
                                    name: "Username",
                                    value: summary.personaname + (summary.realname ? `\n*aka* ${summary.realname}` : ""),
                                    inline: true
                                },
                                {
                                    name: "Country",
                                    value: `${summary.loccountrycode}`,
                                    inline: true
                                },
                            ],
                            footer: {
                                text: "Is this correct?"
                            }
                        }
                    }
                );

    // this.fauna.createUser({id, name: steamUsername, steamId: })

    // const parameters = msg.content.match(/([^ ])+/gi)
    // const username =
    //   parameters.length > 1 ? parameters[1] : msg.member.user.username
    // const steamid = await SteamAPI.Instance.getUserID(username)
    // const summary = await SteamAPI.Instance.getUserSummary(steamid)
    // console.log(parameters)
    //
    // this.discord.createMessage(msg.channel.id, {
    //   embed: {
    //     color: 0x008000,
    //
    //     fields: [
    //       {
    //         inline: true,
    //         name: 'Username',
    //         value:
    //           summary.personaname +
    //           (summary.realname ? `\n*aka* ${summary.realname}` : ''),
    //       },
    //       {
    //         inline: true,
    //         name: 'Country',
    //         value: `${summary.loccountrycode}`,
    //       },
    //     ],
    //
    //     footer: {
    //       text: 'Is this correct?',
    //     },
    //     // description: "Found the following user:",
    //     thumbnail: {
    //       url: summary.avatarmedium,
    //     },
    //     title: '**Found the following user:**',
    //     url: summary.profileurl,
    //   },
    // })
    //
    // this.historyStack.push({
    //   step: Step.REGISTRATION_CONFIRM_NAME,
    //   userId: msg.member.user.id,
    // })
    //msg.member.user.id;
    //msg.member.user.username;
    /*let newUser: User;
                newUser.id = msg.member.id;
                newUser.steamId =

                console.log("New user:", newUser);
                this.database.createNewUser({id: 1, games: "test", steamId: "12345678"})*/
  }
}
