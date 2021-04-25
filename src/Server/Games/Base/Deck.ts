import { Enum } from '../../utils'
import { Card } from './Card'
import { CardSuit, CardType, CardValues, DefaultCardValues } from './DeckEnum'

interface DeckOptions {
  deckType?: DeckType
  overrides?: CardValues
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
  private cards: Card[] = []

  constructor({ deckType = DeckType.FiftyTwo, overrides }: DeckOptions) {
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
            name: `${name} of ${suitKey}`,
            suit: CardSuit[suitKey],
            type: type,
            value: cardValues[type],
          }),
        )
      })
    })

    this.cards.push(...extraCards)
  }

  public shuffle() {
    // Using the modern version of the Fisher–Yates shuffle
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    const array = this.cards
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  public draw() {
    if (this.cards.length <= 0) {
      return undefined
    }

    const card = this.cards.slice(0, 1)[0]
    this.cards = this.cards.slice(1, this.cards.length)
    return card
  }
}
