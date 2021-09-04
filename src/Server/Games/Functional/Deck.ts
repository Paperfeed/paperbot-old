import { Enum, shuffleArray } from '../../utils'
import { Card, createCard } from './Card'
import { CardSuit, CardType, CardValues, DeckType } from './DeckEnums'
import { getExtraCardsByDeckType, getValuesByDeckType } from './DeckUtils'

export interface Deck {
  availableCards: number
  cards: Card[]
  discardedCards: Card[]
  isUnlimited: boolean
}

interface DeckOptions {
  deckType?: DeckType
  overrides?: CardValues
  shuffle?: boolean
  unlimited?: boolean
}

const generateCards = (deckType: DeckType, overrides?: CardValues) => {
  const cards = []
  const cardValues = getValuesByDeckType(deckType, overrides)
  const extraCards = getExtraCardsByDeckType(deckType, cardValues)
  Enum.keys(CardSuit).forEach(suitKey => {
    Enum.entries(CardType).forEach(([name, type]) => {
      // Don't add disabled cards
      if (cardValues[type] === -1 || type === CardType.Joker) {
        return
      }

      cards.push(
        createCard({
          fullName: `${name} of ${suitKey}`,
          name,
          suit: CardSuit[suitKey],
          type: type,
          value: cardValues[type],
        }) as Card,
      )
    })
  })

  cards.push(...extraCards)
  return cards
}

export const createDeck = (options: DeckOptions = {}): Deck => {
  const {
    deckType = DeckType.FiftyTwo,
    overrides,
    unlimited,
    shuffle = true,
  } = options
  const cards = generateCards(deckType, overrides)

  return {
    availableCards: cards.length,
    cards: shuffle ? shuffleArray(cards) : cards,
    discardedCards: [],
    isUnlimited: Boolean(unlimited),
  }
}

export const shuffleDeck = (deck: Deck): Deck => ({
  ...deck,
  cards: shuffleArray([...deck.cards]),
})

export const drawCard = (deck: Deck, options: DrawCardOptions = {}): Card => {
  const { allowPartialDraw = false, hideOnDraw = false } = options

  const cardsInDeck = deck.cards.length
  if (cardsInDeck < 1 && !allowPartialDraw) {
    throw new Error('No cards left!')
  } else {
    const cards = deck.cards.slice(0, 1)
    deck.cards = deck.cards.slice(1, deck.cards.length)
    if (hideOnDraw) cards[0].flip(true)
    return cards[0]
  }
}

interface DrawCardOptions {
  allowPartialDraw?: boolean
  hideOnDraw?: boolean
}

export const drawCards = (
  deck: Deck,
  amount = 1,
  options: DrawCardOptions = {},
): Card[] => {
  const { allowPartialDraw = false, hideOnDraw = false } = options

  const cardsInDeck = deck.cards.length
  if (cardsInDeck < amount && !allowPartialDraw) {
    throw new Error('No cards left!')
  }

  const index = Math.min(amount, cardsInDeck)
  const cards = deck.cards.slice(0, index)
  deck.cards = deck.cards.slice(index, deck.cards.length)

  if (hideOnDraw) cards.forEach(c => c.flip(true))
  return cards
}
