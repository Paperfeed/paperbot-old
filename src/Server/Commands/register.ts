import { Emoji } from '../Data/Emoji'
import { ifArrayGetFirstItem } from '../utils'
import { Command } from './index'

export const register = {
  fn: async function (msg) {
    const parameters = msg.content.match(/([^ ])+/gi)
    const id = msg.member.user.id

    const userFromDB = await this.fauna.retrieveUser(id).catch(() => undefined)

    if (userFromDB) {
      msg.reply(`You're already registered as ${userFromDB}`)
      return
    }

    const steamUsername =
      parameters.length > 1 ? parameters[1] : msg.member.user.username
    const steamId = await this.steam.resolve(steamUsername)
    const summary = steamId
      ? ifArrayGetFirstItem(await this.steam.getUserSummary(steamId))
      : undefined

    if (summary) {
      const reply = await msg.reply({
        embed: {
          color: 0x008000,
          // description: 'Found the following user:',
          fields: [
            {
              inline: true,
              name: 'Username',
              value:
                summary.personaName +
                (summary.realName ? `\n*aka* ${summary.realName}` : ''),
            },
            {
              inline: true,
              name: 'Country',
              value: summary.locCountyCode || '-',
            },
          ],
          footer: {
            text: 'Is this correct?',
          },
          thumbnail: {
            url: summary.avatar.full,
          },
          title: '**Found the following user:**',
          url: summary.profileUrl,
        },
      })

      await reply.react(Emoji.WhiteCheckMark)

      reply
        .awaitReactions(
          (reaction, user) =>
            [Emoji.HeavyCheckMark].includes(reaction.emoji.name) &&
            user.id === id,
          { errors: ['time'], max: 1, time: 60000 },
        )
        .then(collected => {
          const reaction = collected.first()
          console.log('reaction')
          console.log(collected, reaction)
          if (reaction?.emoji.name === Emoji.HeavyCheckMark) {
            reply.edit(`Registering as ${steamUsername}, please wait...`)
          }
        })
        .catch(() => {
          // User didn't respond. Remove message completely
          reply.delete()
        })
    } else {
      msg.reply('No user found, make sure your profile is set to public')
    }
  },
  matcher: msg => msg.content.startsWith('!register'),
} as Command
