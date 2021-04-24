import { Command } from './index'

export const help = {
  fn: function (msg) {
    msg.channel.send(
      `Type \`!register <<steam username>>\` to register yourself with Paperbot, \nafter which you can join in on game selection rounds`,
    )
  },
  matcher: msg => msg.content.startsWith('!help'),
} as Command
