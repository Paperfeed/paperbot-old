import { Message, PartialUser, User } from 'discord.js'

import { CardPlayer, createBotPlayer, createPlayer } from '../Functional/Player'
import { PokerAction } from './PokerEnums'

export interface PokerPlayer extends CardPlayer {
  bet: number
  cash: number
  hasFolded?: boolean
  lastMove?: PokerAction
  lastMsg: Message | null
}

export const createPokerPlayer = (
  user: User | PartialUser | undefined,
  asBot = false,
): PokerPlayer => ({
  ...(asBot ? createBotPlayer() : createPlayer(user)),
  bet: 0,
  cash: 100,
  lastMsg: null,
})
