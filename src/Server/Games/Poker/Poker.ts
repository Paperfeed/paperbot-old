import { stripIndent } from 'common-tags'
import {
  DMChannel,
  Message,
  MessageAttachment,
  NewsChannel,
  TextChannel,
} from 'discord.js'

import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { Paperbot } from '../../Paperbot'
import { isDev } from '../../utils'
import { Card } from '../Functional/Card'
import { createDeck, Deck } from '../Functional/Deck'
import { chooseDealer } from './chooseDealer'
import { createPokerPlayer, PokerPlayer } from './createPokerPlayer'
import { foreplay } from './foreplay'
import { initializePokerGame } from './initializeGame'
import { renderPokerTable } from './PokerCanvas'

export interface PokerState {
  blindAmount: number
  cardsOnTable: Card[]
  channel: TextChannel | DMChannel | NewsChannel
  currentPlayer: number
  dealer: PokerPlayer
  dealerIndex: number
  deck: Deck
  lastRaise: number
  muck: Card[]
  playerAmount: number
  players: PokerPlayer[]
  pot: number
  round: number
  roundHasBet: boolean
}

export const sendToAllPlayers = (state: PokerState, content: MessageEmbed) =>
  state.players.forEach(p => !p.isBot && p.discord.send(content))

export const playPoker = async (bot: Paperbot, msg: Message) => {
  const state: PokerState = {
    blindAmount: 2,
    cardsOnTable: [],
    channel: msg.channel,
    currentPlayer: 0,
    dealer: undefined,
    dealerIndex: 0,
    deck: createDeck(),
    lastRaise: 0,
    muck: [],
    playerAmount: 0,
    players: [],
    pot: 0,
    round: 1,
    roundHasBet: false,
  }

  if (isDev()) {
    const dealer = createPokerPlayer(undefined, true)
    state.dealer = dealer
    state.currentPlayer = 1
    state.players.push(dealer)
    state.players.push(createPokerPlayer(msg.author))
    state.players.push(createPokerPlayer(undefined, true))
    state.players.push(createPokerPlayer(undefined, true))
    state.players.push(createPokerPlayer(undefined, true))
    state.players.push(createPokerPlayer(undefined, true))
    state.playerAmount = 6
  } else {
    await initializePokerGame(state, msg)
    await chooseDealer(state)
  }

  const buffer = await renderPokerTable(state)
  const content = new MessageEmbed()
    .attachFiles([new MessageAttachment(buffer, 'table.png')])
    .setImage(`attachment://table.png`)
    .setTitle(`Poker game started!`)
    .setDescription(`The game has started. It will continue in your DMs.`)
    .addField('Players', state.players.map(p => p.tag).join('\n'))
  msg.channel.send(content)

  await loop(state)
}

const loop = async (state: PokerState): Promise<void> => {
  // Foreplay
  if (state.round === 1) {
    await foreplay(state)
  }

  return loop(state)
}
