import { Card, createCard } from './Card'
import { CardType, CardValues, DeckType, defaultCardValues } from './DeckEnums'

export const getValuesByDeckType = (
  deckType: DeckType,
  overrides?: Partial<CardValues>,
): CardValues => {
  switch (deckType) {
    case DeckType.FiftyFour:
      return {
        ...defaultCardValues,
        [CardType.Joker]: 14,
        ...overrides,
      }
    case DeckType.FiftyTwo:
    default:
      return { ...defaultCardValues, ...overrides }
  }
}

export const getExtraCardsByDeckType = (
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

      return [createCard(jokerOpts), createCard(jokerOpts)]
  }
}
