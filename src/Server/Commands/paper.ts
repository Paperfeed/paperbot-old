import { stripIndent } from 'common-tags'
import { GuildMember } from 'discord.js'

import { Command } from './index'

const isAdmin = (user: GuildMember) => user.hasPermission('ADMINISTRATOR')

export const paper = {
  fn: function (prefix, msg, params) {
    const command = params[1] || 'help'
    switch (command) {
      case 'prefix':
        if (!isAdmin(msg.member)) return
        const newPrefix = params[2] || ' '
        console.log(newPrefix, prefix)
        if (newPrefix === prefix) {
          msg.channel.send(`Prefix is already set to \`${newPrefix}\``)
        } else if (newPrefix.length <= 2) {
          this.fauna
            .writeGuildSettings(msg.guild.id, { prefix: newPrefix })
            .catch(e => console.error(e))

          this.prefixMap.set(msg.guild.id, params[2])
          msg.channel.send(`Prefix set to \`${newPrefix}\``)
        } else {
          msg.channel.send(`\`${newPrefix}\` is not a valid prefix.`)
        }
        break
      case 'register':
        msg.channel.send(
          `Type \`${prefix}register\` to register yourself with Paperbot, \nafter which you can join in on game selection rounds`,
        )
        break
      case 'help':
        msg.channel.send(stripIndent`
            Type \`${prefix}paper\` followed by any of the following commands:
            
            **help** - To display this message
            **prefix** - To set the prefix that Paperbot responds to
            **register** - To register with Paperbot through Valve's openID so you can compare games with other users
          `)
    }
  },
  matcher: function (prefix, msg) {
    return msg.content.startsWith(`${prefix}paper`)
  },
} as Command
