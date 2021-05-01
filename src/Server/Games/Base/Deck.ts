import { Enum, shuffleArray } from '../../utils'
import { Card } from './Card'
import { CardSuit, CardType, CardValues, DefaultCardValues } from './DeckEnum'

interface DeckOptions {
  deckType?: DeckType
  overrides?: CardValues
  unlimited?: boolean
}

enum DeckType {
  FiftyTwo,
  FiftyFour,
}

const getValuesByDeckType = (
  deckType: DeckType,
  overrides?: Partial<CardValues>,
): CardValues => {
  switch (deckType) {
    case DeckType.FiftyFour:
      return {
        ...DefaultCardValues,
        [CardType.Joker]: 14,
        ...overrides,
      }
    case DeckType.FiftyTwo:
    default:
      return { ...DefaultCardValues, ...overrides }
  }
}

const getExtraCardsByDeck = (
  deckType: DeckType,
  values: CardValues,
): Card[] => {
  switch (deckType) {
    case DeckType.FiftyTwo:
      return []
    case DeckType.FiftyFour:
      const jokerOpts = {
        type: CardType.Joker,
        value: values[CardType.Joker],
      }

      return [new Card(jokerOpts), new Card(jokerOpts)]
  }
}

export class Deck {
  public remainingCards: number
  private cards: Card[] = []
  private unlimited: boolean
  private deckType: DeckType
  private overrides: CardValues

  constructor(deckOptions: DeckOptions = {}) {
    const { deckType = DeckType.FiftyTwo, overrides, unlimited } = deckOptions
    this.unlimited = unlimited
    this.deckType = deckType
    this.overrides = overrides
    this.generateCards()
  }

  public shuffle = () => shuffleArray(this.cards)

  public draw = (hidden?: boolean) => {
    if (this.cards.length <= 0) {
      if (this.unlimited) {
        this.generateCards()
        this.shuffle()
      } else {
        throw new Error('Deck is empty')
      }
    }

    const card = this.cards[0]
    if (hidden) card.flip(false)

    this.cards = this.cards.slice(1, this.cards.length)
    if (!this.unlimited) this.remainingCards--

    return card
  }

  public drawMultiple = (amount: number, hidden?: boolean) => {
    const cards = []
    try {
      for (let i = 0; i < amount; i++) {
        cards.push(this.draw(hidden))
      }
      return cards
    } catch (e) {
      console.error('Could not draw all cards because deck is empty')
      return cards
    }
  }

  private generateCards = () => {
    const { deckType, overrides } = this
    const cardValues = getValuesByDeckType(deckType, overrides)
    const extraCards = getExtraCardsByDeck(deckType, cardValues)

    Enum.keys(CardSuit).forEach(suitKey => {
      Enum.entries(CardType).forEach(([name, type]) => {
        // Don't add disabled cards
        if (cardValues[type] === -1 || type === CardType.Joker) {
          return
        }

        this.cards.push(
          new Card({
            fullName: `${name} of ${suitKey}`,
            name,
            suit: CardSuit[suitKey],
            type: type,
            value: cardValues[type],
          }),
        )
      })
    })

    this.cards.push(...extraCards)
    this.remainingCards = this.cards.length
  }
}
