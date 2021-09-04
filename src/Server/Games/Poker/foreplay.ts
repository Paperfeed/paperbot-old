import { stripIndent, stripIndents } from 'common-tags'
import { MessageAttachment } from 'discord.js'

import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { reactionFilter } from '../../utils'
import { drawCard } from '../Functional/Deck'
import { PokerState } from './Poker'
import { addToPot, PlayerAction, raiseHelper } from './pokerActions'
import { renderPokerCards, renderPokerTable } from './PokerCanvas'
import { PokerBtn } from './PokerEnums'

export const foreplay = async (state: PokerState) => {
  const dealerIndex = state.dealerIndex
  const dealer = state.dealer
  const playerAmount = state.playerAmount

  // Draw two cards for each player
  for (let i = 0; i < playerAmount * 2; i++) {
    const player = state.players[(i + dealerIndex + 1) % playerAmount]
    player.cards.push(drawCard(state.deck, { hideOnDraw: true }))
  }

  const smallBlind = state.players[(dealerIndex + 1) % playerAmount]
  const bigBlind = state.players[(dealerIndex + 2) % playerAmount]

  addToPot(state, smallBlind, Math.round(state.blindAmount / 2))
  addToPot(state, bigBlind, Math.round(state.blindAmount))

  const currentPlayerIndex = state.currentPlayer
  const currentPlayer = state.players[currentPlayerIndex]

  await Promise.all(
    state.players.map(async (player, index) => {
      if (player.isBot) {
        return new Promise(resolve => {})
      }

      const isCurrentPlayer = currentPlayerIndex === index
      const tableBuffer = await renderPokerTable(state, player.id)
      const cardBuffer = await renderPokerCards(player.cards, {
        hideCards: false,
      })
      const content = new MessageEmbed()
        .setTitle('Foreplay')
        .attachFiles([
          new MessageAttachment(cardBuffer, 'cards.png'),
          new MessageAttachment(tableBuffer, 'table.png'),
        ])
        .setThumbnail('attachment://cards.png')
        .setDescription(
          stripIndent`
          ${dealer.tag} is the dealer and dealt everyone two cards.
          
          ${smallBlind.tag} played a _small blind_ of ${Math.min(
            smallBlind.cash - Math.round(state.blindAmount / 2),
            Math.round(state.blindAmount / 2),
          )}
          ${bigBlind.tag} played a _big blind_ of ${Math.min(
            bigBlind.cash - state.blindAmount,
            state.blindAmount,
          )}
          
          It is ${
            isCurrentPlayer
              ? stripIndents`**your** turn.
            
            Click ${PokerBtn.Fold} to fold
            Click ${PokerBtn.Call} to call
            Type a number and click ${PokerBtn.Raise} to raise
            `
              : `${currentPlayer.tag}'s turn`
          }
        `,
        )
        .setImage('attachment://table.png')

      player.lastMsg?.delete()

      const { call, fold } = PlayerAction(state, player)

      if (!isCurrentPlayer) {
        player.discord.send(content)
      } else {
        const msg = await player.discord.send(content)
        player.lastMsg = msg

        await new Promise<void>(resolve => {
          msg.react(PokerBtn.Fold).then(() => msg.react(PokerBtn.Call))
          raiseHelper(state, msg, content, player, () => resolve())

          msg
            .createReactionCollector(
              reactionFilter([PokerBtn.Fold, PokerBtn.Call], player.id),
            )
            .on('collect', reaction => {
              if (reaction.emoji.name === PokerBtn.Fold) {
                fold()
              }
              if (reaction.emoji.name === PokerBtn.Call) {
                call()
              }
              resolve()
            })
        })
      }
    }),
  )

  console.log('Foreplay finished')
}
