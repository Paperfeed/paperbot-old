import { PartialUser, User } from 'discord.js'
import {
  adjectives,
  animals,
  colors,
  names,
  uniqueNamesGenerator,
} from 'unique-names-generator'
import { v4 as uuidv4 } from 'uuid'

import { Card } from './Card'

export interface CardPlayer {
  avatar?: string
  cards: Card[]
  discord: User | PartialUser
  id: string
  isBot: boolean
  name: string
  tag: string
}

interface BotUser extends Omit<CardPlayer, 'discord'> {
  discord: undefined
}

export const createBotPlayer = (): BotUser => {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, Math.random() > 5 ? names : animals],
    separator: ' ',
    style: 'capital',
  })

  return {
    avatar: '',
    cards: [],
    discord: undefined,
    id: uuidv4(),
    isBot: true,
    name,
    tag: `**${name}**`,
  }
}

export const createPlayer = (user: User | PartialUser): CardPlayer => ({
  avatar: user.avatarURL(),
  cards: [],
  discord: user,
  id: user.id,
  isBot: false,
  name: user.username,
  tag: `<@${user.id}>`,
})
