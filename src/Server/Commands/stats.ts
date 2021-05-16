import { MessageEmbed } from '../Extensions/MessageEmbed'
import { Command } from './index'

export const stats = {
  fn: async function (prefix, msg) {
    if (msg.guild) {
      const guildId = msg.guild.id

      const guildStats = await this.fauna.getGuildStats(guildId)

      const userIds = guildStats.map(s => s._id)
      const members = await msg.guild.members.fetch({ user: userIds })

      const content = new MessageEmbed()
        .setTitle('Guild stats')
        .setDescription('Overview of user stats on this Guild')

      guildStats.sort((a, b) => b.drinks + b.chugs - (a.drinks + a.chugs))
      guildStats.forEach(s => {
        const member = members.get(s._id)
        if (!member) {
          console.error(
            `Somehow the user for ${s._id} does not exist anymore or was failed to be fetched`,
          )
          return
        }
        const stats = (Object.keys(s) as (keyof typeof s)[]).reduce(
          (string, key) => {
            if (key !== '_id' && key !== '__typename' && s[key])
              string += `${key}: ${s[key]}\n`
            return string
          },
          '',
        )
        content.addField(member.user.username, stats)
      })

      msg.channel.send(content)
    }
  },
  matcher: (prefix, msg) => msg.content.startsWith(`${prefix}stats`),
  stopPropagation: true,
} as Command
