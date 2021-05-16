import { MessageEmbed } from 'discord.js'

import { Command } from './index'

export const register = {
  fn: async function (prefix, msg) {
    const id = msg.author.id
    const userFromDB = await this.fauna.findUser(id)

    if (userFromDB.steamId) {
      msg.reply(`You're already registered as ${userFromDB.userName}`)
      return
    }

    const dm = await msg.author.createDM()
    await dm.send(
      new MessageEmbed()
        .setTitle('To register visit this link to sign in with Steam OpenID')
        .setURL(`http://localhost:3000/auth/steam?userId=${msg.author.id}`),
    )
    return

    /*const steamUsername =
      parameters.length > 1 ? parameters[1] : msg.member.user.username
    const steamId = await this.steam.getSteamId(steamUsername)
    const summary = steamId
      ? await this.steam.getUserSummary(steamId)
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
                summary.personaname +
                (summary.realname ? `\n*aka* ${summary.realname}` : ''),
            },
            {
              inline: true,
              name: 'Country',
              value: summary.loccountrycode || '-',
            },
          ],
          footer: {
            text: 'Is this correct?',
          },
          thumbnail: {
            url: summary.avatarfull,
          },
          title: '**Found the following user:**',
          url: summary.profileurl,
        },
      })

      await reply.react(Emoji.WhiteCheckMark)
      await reply.react(Emoji.NoEntrySign)

      reply
        .awaitReactions(
          (reaction: MessageReaction, user) =>
            [Emoji.HeavyCheckMark, Emoji.NoEntrySign].includes(
              reaction.emoji.name as Emoji,
            ) && user.id === id,
          { errors: ['time'], max: 1, time: 60000 },
        )
        .then(collected => {
          const reaction = collected.first()

          switch (reaction?.emoji.name) {
            case Emoji.HeavyCheckMark:
              reply.edit(`Registering as ${steamUsername}, please wait...`, {})
              // this.fauna.createUser({id, name: steamUsername, steamId: })
              return
            case Emoji.NoEntrySign:
              reply.edit(
                `Please retry the search with another username, make sure you set your steam profile to public`,
              )
              return
          }
        })
        .catch(() => {
          // User didn't respond. Remove message completely
          reply.delete()
        })
    } else {
      msg.reply('No user found, make sure your profile is set to public')
    }*/
  },
  matcher: (prefix, msg) => msg.content.startsWith(`${prefix}register`),
} as Command
