import { lensProp, map, pipe, uniq, view } from 'ramda'

import { formatCode } from '../../utils'
import {
  CardBack,
  CardSuit,
  CardType,
  DefaultCardValues,
  getCardTemplate,
} from './DeckEnum'

export interface CardOptions {
  fullName?: string
  isHidden?: boolean
  name?: string
  suit?: CardSuit
  type: CardType
  value?: number
}

const suitIcon: Record<CardSuit, string> = {
  [CardSuit.Clubs]: '♣',
  [CardSuit.Diamonds]: '♦',
  [CardSuit.Spades]: '♠',
  [CardSuit.Hearts]: '♥',
}

const CARD_BACK_ASSET = '/assets/cards/card_back.png'
export class Card {
  fullName: string
  name: string
  shortName: string
  suit?: CardSuit
  suitIcon: string
  type: CardType
  value: number
  isHidden: boolean
  color: 'red' | 'black' | undefined
  assetPath: string
  id: string
  renderOpacity: number
  private frontAssetPath: string

  constructor({ fullName, isHidden, name, suit, type, value }: CardOptions) {
    const isSpecialCard = !(type >= 1 && type <= 9)
    const shortSuit = CardSuit[suit]?.slice(0, 1) || ''

    this.id = `${type}${suit}${value}`
    this.fullName = fullName || name || CardType[type]
    this.name = name || CardType[type]
    this.suit = suit
    this.type = type
    this.value = value || DefaultCardValues[type]
    this.isHidden = isHidden || false
    this.shortName = isSpecialCard
      ? this.name.slice(0, 1)
      : this.value.toString()
    this.suitIcon = suitIcon[suit] || ' '
    this.color = [CardSuit.Hearts, CardSuit.Diamonds].includes(suit)
      ? 'red'
      : 'black'
    this.frontAssetPath = `/assets/cards/${
      isSpecialCard
        ? `${this.shortName}${shortSuit}`
        : `${this.value}${shortSuit}`
    }.png`
    this.assetPath = this.isHidden ? CARD_BACK_ASSET : this.frontAssetPath
  }

  static lineUpASCIICards = (asciiCards: string[], spacing = 2) => {
    const amountOfCards = asciiCards.length
    const amountOfLines = asciiCards[0].split('\n').length
    const lines = new Array(amountOfLines).fill('')
    const cards = asciiCards.map(c => c.split('\n'))

    cards.forEach((cardLines, cardIndex) =>
      cardLines.forEach((cardLine, index) => {
        return (lines[index] += `${cardLine}${
          cardIndex < amountOfCards - 1 ? ' '.repeat(spacing) : ''
        }`)
      }),
    )

    return formatCode(lines.join('\n'))
  }

  public flip = (show?: boolean) => {
    this.isHidden = show !== undefined ? !show : !this.isHidden
    this.assetPath = this.assetPath = this.isHidden
      ? CARD_BACK_ASSET
      : this.frontAssetPath

    return this
  }

  public toASCII = () => {
    if (this.isHidden) return CardBack

    return `${getCardTemplate(this.type)}`
      .replace(/==/g, this.shortName.padStart(2))
      .replace(/\//g, this.suitIcon)
      .replace(/-/g, this.suitIcon)
  }
}

export const getUniqueCardSuits = (card: Card[]) =>
  pipe(map(view(lensProp<Card>('suitIcon'))), uniq)(card).sort()
