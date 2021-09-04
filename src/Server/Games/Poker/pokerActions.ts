import { Message } from 'discord.js'

import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { messageFilter } from '../../utils'
import { Currency } from '../Base/cardGameUtils'
import { PokerPlayer } from './createPokerPlayer'
import { PokerState } from './Poker'
import { PokerAction, PokerBtn } from './PokerEnums'

const endGame = (state: PokerState) => {
  state.round = 666
}

const nextPlayer = (state: PokerState) => {
  const playerAmount = state.playerAmount
  let nextPlayerIndex = (state.currentPlayer + 1) % state.playerAmount
  while (1) {
    if (nextPlayerIndex === state.currentPlayer) {
      endGame(state)
      break
    }
    if (state.players[nextPlayerIndex].hasFolded) {
      nextPlayerIndex = (nextPlayerIndex + 1) % playerAmount
    } else {
      break
    }
  }
  state.currentPlayer = nextPlayerIndex
}

const nextRound = (state: PokerState) => {
  state.round++
  state.roundHasBet = false
}

const check = (state: PokerState, player: PokerPlayer) => () => {
  player.lastMove = PokerAction.Check
  nextPlayer(state)
}

const bet = (state: PokerState, player: PokerPlayer) => () => {
  player.lastMove = PokerAction.Check
  state.roundHasBet = true
  nextPlayer(state)
}

const fold = (state: PokerState, player: PokerPlayer) => () => {
  state.muck.push(...player.cards)
  player.cards = []
  player.hasFolded = true
  nextPlayer(state)
}

const call = (state: PokerState, player: PokerPlayer) => () => {
  if (player.cash - state.lastRaise >= 0) {
    player.cash -= state.lastRaise
    nextPlayer(state)
  } else {
    throw new Error("Player doesn't have enough cash")
  }
}

const raise = (state: PokerState, player: PokerPlayer) => (amount: number) => {
  if (player.cash - amount >= 0) {
    state.pot += amount
    state.lastRaise = amount
    player.cash -= amount
    nextPlayer(state)
  } else {
    throw new Error("Player doesn't have enough cash")
  }
}

export const raiseHelper = (
  state: PokerState,
  msg: Message,
  content: MessageEmbed,
  player: PokerPlayer,
  onRaise: () => void,
) => {
  msg.react(PokerBtn.Raise)

  const collector = msg.channel.createMessageCollector(
    messageFilter({ isInRange: [1, player.cash] }),
  )
  collector.on('collect', (message: Message) => {
    const amount = Number(message.content)

    if (amount > 0 && amount <= player.cash) {
      content.editField('Raise by', amount)
      msg.edit(content)
      raise(state, player)(amount)
      collector.stop()
      onRaise()
    } else {
      message.reply(
        `Invalid amount, you have ${Currency.format(player.cash)} left`,
      )
      message.delete()
    }
  })
}

export const addToPot = (
  state: PokerState,
  player: PokerPlayer,
  amount: number,
) => {
  const calculatedValue = Math.max(player.cash - amount, 0)
  player.cash = calculatedValue
  state.pot += calculatedValue
  nextPlayer(state)
}

export const PlayerAction = (state: PokerState, player: PokerPlayer) => ({
  bet: bet(state, player),
  call: call(state, player),
  check: check(state, player),
  fold: fold(state, player),
  raise: raise(state, player),
})
