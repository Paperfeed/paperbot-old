import { Message } from 'discord.js'

import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { reactionFilter } from '../../utils'
import { Button } from '../Bussen/Button'
import { createPokerPlayer } from './createPokerPlayer'
import { PokerState } from './Poker'

export const initializePokerGame = async (state: PokerState, msg: Message) => {
  const content = new MessageEmbed()
    .setTitle(`${msg.author.username} wants to start a game of poker`)
    .setDescription(
      `Click on ${Button.Join} to join and ${Button.Start} to start`,
    )
    .addFields([
      {
        name: 'Blind',
        value: 5,
      },
    ])

  const reply = await msg.reply(content)
  reply.react(Button.Join).then(() => reply.react(Button.Start))

  const updatePlayerList = () => {
    if (state.players.length) {
      content.editField(
        'Players',
        state.players.map(p => p.tag).join('\n'),
        true,
      )
    } else {
      content.fields = undefined
    }
    reply.edit(content)
  }

  reply
    .createReactionCollector(reactionFilter(Button.Join), { dispose: true })
    .on('collect', (_reaction, user) => {
      state.players.push(createPokerPlayer(user))
      updatePlayerList()
    })
    .on('remove', (_reaction, user) => {
      console.log('removed')
      state.players = state.players.filter(u => u.id !== user.id)
      updatePlayerList()
    })

  await reply.awaitReactions(
    reactionFilter(Button.Start, msg.author.id, () => state.players.length > 0),
    {
      max: 1,
    },
  )

  state.playerAmount = state.players.length
  reply.delete()
}
