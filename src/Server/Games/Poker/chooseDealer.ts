import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { createDeck, drawCard } from '../Functional/Deck'
import { PokerState, sendToAllPlayers } from './Poker'

export const chooseDealer = (state: PokerState) => {
  const deck = createDeck()

  const cards = state.players.map(() => drawCard(deck).value)
  const highestValue = cards.reduce(
    (max, b, index) => (max.amount <= b ? { amount: b, index } : max),
    { amount: 0, index: 0 },
  )

  const dealer = state.players[highestValue.index]
  const content = new MessageEmbed().setDescription(
    `${dealer.tag} has been chosen as a dealer`,
  )
  sendToAllPlayers(state, content)

  state.dealer = dealer
  state.dealerIndex = highestValue.index
  return dealer
}
