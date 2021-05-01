import {
  ClientEvents,
  DMChannel,
  MessageEmbed,
  NewsChannel,
  PartialUser,
  TextChannel,
  User,
} from 'discord.js'
import EventEmitter from 'events'

import { Paperbot } from '../../Paperbot'
import { Event, EventFn } from '../Bussen/Events'
import { Card } from './Card'
import { Deck } from './Deck'

export interface Player {
  avatar?: string
  cards: Card[]
  id: string
  lastDrawnCard?: Card
  name: string
  tag: string
}

export class CardGame {
  public players: Player[] = []
  public paperBot: Paperbot
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handlers: [keyof ClientEvents, (...args: any) => void][] = []
  public dealer: Player
  public previousDealer: Player | undefined
  public previousPlayer: Player
  public currentPlayer: Player
  public channel: DMChannel | TextChannel | NewsChannel
  public round = 1
  public roundOrder = 0
  public deck: Deck
  public discardStack: Card[] = []
  private eventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
  }

  /**
   * Event functions
   */
  public on<T extends Event>(event: T, callback: EventFn[T]) {
    this.eventEmitter.on((event as unknown) as string, callback)
    return callback
  }

  public once<T extends Event>(event: T, callback: EventFn[T]) {
    this.eventEmitter.once((event as unknown) as string, callback)
    return callback
  }

  public off<T extends Event>(event: T, callback: EventFn[T]) {
    this.eventEmitter.off((event as unknown) as string, callback)
  }

  public emit<T extends Event>(event: T, ...args: Parameters<EventFn[T]>) {
    this.eventEmitter.emit((event as unknown) as string, ...args)
  }

  public removeAllListeners(event: Event) {
    this.eventEmitter.removeAllListeners((event as unknown) as string)
  }

  /**
   * Player functions
   */
  public addPlayer = (
    user: User | PartialUser,
    overrides?: Partial<Player>,
  ) => {
    this.players.push({
      avatar: user.avatarURL(),
      cards: [],
      id: user.id,
      name: user.username,
      tag: `<@${user.id}>`,
      ...overrides,
    })
  }

  public removePlayer = (user: User | PartialUser) =>
    (this.players = this.players.filter(p => p.id !== user.id))

  public getPlayerIndex = (player: Player) =>
    this.players.findIndex(p => p.id === player.id)

  public getPlayerById = (id: string) => this.players.find(p => p.id === id)

  public getNextPlayer = () =>
    this.players[
      (this.getPlayerIndex(this.currentPlayer) + 1) % this.players.length
    ]

  public setCurrentPlayer = (player: Player) => {
    this.previousPlayer = this.currentPlayer
    this.currentPlayer = player
    return player
  }

  public filterPlayers = (exclude?: Player | Player[]) =>
    Array.isArray(exclude)
      ? this.players.filter(p => !exclude.map(p => p.id).includes(p.id))
      : this.players.filter(p => p.id !== exclude?.id)

  public pickRandomPlayer = (exclude?: Player | Player[]) =>
    this.filterPlayers(exclude)[Math.floor(Math.random() * this.players.length)]

  public getPlayerCards = (
    amount: number,
    player: Player = this.currentPlayer,
  ) => {
    const length = player.cards.length
    const cardIndex = length - amount
    return cardIndex >= 0 ? player.cards.slice(cardIndex, length) : player.cards
  }

  public playerDrawCards = (amount: number, player = this.currentPlayer) => {
    for (let i = 0; i < amount; i++) {
      try {
        this.playerDrawCard(player)
      } catch (e) {
        console.error(`Couldn't draw all cards, drew ${i} cards`)
      }
    }
  }

  public playerDrawCard = (player = this.currentPlayer) => {
    const card = this.deck.draw()
    if (!card) {
      throw new Error("Couldn't draw card")
    }
    player.cards.push(card)
    player.lastDrawnCard = card
    return card
  }

  public removeCardFromPlayer = (card: Card, player: Player) => {
    const foundPlayer = this.players.find(p => p.id === player.id)
    foundPlayer.cards = player.cards.filter(c => c.id !== card.id)
    this.discardStack.push(card)
  }

  /**
   * Round functionality
   */
  public setRound = (nr: number) => {
    this.round = nr
    this.roundOrder = 0
  }

  /**
   * Message formatting
   */
  public updatePlayerFields = (embed: MessageEmbed) => {
    embed.fields = [
      {
        inline: true,
        name: 'Current player',
        value: this.currentPlayer.name,
      },
      { inline: true, name: 'Next up', value: this.getNextPlayer().name },
    ]
  }
}
