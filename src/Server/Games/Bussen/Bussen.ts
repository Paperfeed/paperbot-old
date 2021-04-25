import { Message, MessageEmbed, MessageReaction } from 'discord.js'

import { Paperbot } from '../../Paperbot'
import { EmojiHelper } from '../../utils'

interface Player {
  id: string
  name: string
}

export class Bussen {
  private players: Player[] = []
  private paperBot: Paperbot

  constructor(paperBot: Paperbot, msg: Message) {
    this.initiateGame(msg)
    this.paperBot = paperBot
  }

  public addPlayer = (player: Player) => {
    this.players.push(player)
  }

  private initiateGame = async (msg: Message) => {
    const reply = await msg.reply(
      new MessageEmbed()
        .setTitle(`${msg.author.username} wants to start a round of Bussen`)
        .setDescription(`Click on ⬆ to join and 🔫 to start`),
    )

    const emojis = ['⬆', '🔫']
    await EmojiHelper.addReactions(emojis, reply)

    this.paperBot.discord.on('messageReactionAdd', (msgReaction, user) => {
      if (
        msgReaction.message.id === reply.id &&
        msgReaction.emoji.name === '⬆' &&
        !user.bot
      ) {
        this.players.push({ id: user.id, name: user.username })
        reply.edit(
          new MessageEmbed().addField(
            'Players',
            this.players.map(p => p.name).join('\n'),
          ),
        )
      }
    })

    reply // Wait for start
      .awaitReactions(
        (reaction: MessageReaction, user) =>
          '🔫' === reaction.emoji.name && user.id === msg.author.id,
        {
          max: 1,
        },
      )
      .then(collected => {
        const reaction = collected.first()
        this.startGame(reaction.message)
      })
  }

  private startGame = (msg: Message) => {
    msg.delete()
    msg.channel.send(`Starting Game`)
  }

  private quitGame = () => {}
}
