import {
  CardBack,
  CardSuit,
  CardType,
  DefaultCardValues,
  getCardTemplate,
} from './DeckEnum'

export interface CardOptions {
  isFlipped?: boolean
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

export class Card {
  name: string
  shortName: string
  suit?: CardSuit
  suitIcon: string
  type: CardType
  value: number
  isFlipped: boolean

  constructor({ isFlipped, name, suit, type, value }: CardOptions) {
    this.name = name || CardType[type]
    this.suit = suit
    this.type = type
    this.value = value || DefaultCardValues[type]
    this.isFlipped = isFlipped || false
    this.shortName =
      type > 0 && type < 11 ? this.value.toString() : this.name.slice(0, 1)
    this.suitIcon = suitIcon[suit] || ' '
  }

  public flip() {
    this.isFlipped = !this.isFlipped
  }

  public toASCII() {
    if (this.isFlipped) return CardBack

    return `${getCardTemplate(this.type)}`
      .replace(/==/g, this.shortName.padStart(2))
      .replace(/\//g, this.suitIcon)
      .replace(/-/g, this.suitIcon)
  }
}
