import { DMChannel } from 'discord.js'

import { MessageEmbed } from '../Extensions/MessageEmbed'
import { Command } from './index'

// https://discord.com/developers/applications/531120178453544961/bot
const PERMISSION_BIT = 37224000

export const invite: Command = {
  fn: async function (prefix, msg) {
    if (msg.channel instanceof DMChannel) {
      const response = await this.discord.fetchApplication()
      msg.reply(
        new MessageEmbed()
          .setTitle('Click this link to invite the bot to your server')
          .setURL(
            `https://discord.com/oauth2/authorize?client_id=${response.id}&scope=bot&permissions=${PERMISSION_BIT}`,
          ),
      )
    }
  },
  matcher: (prefix, msg) => msg.content.startsWith(`${prefix}invite`),
  stopPropagation: true,
}
