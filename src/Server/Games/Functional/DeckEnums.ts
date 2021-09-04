export enum CardSuit {
  Diamonds,
  Spades,
  Hearts,
  Clubs,
}

export enum CardType {
  Ace,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  Joker,
}

export enum DeckType {
  FiftyTwo,
  FiftyFour,
}

export type CardValues = Record<CardType, number>

// -1 is disabled
export const defaultCardValues: CardValues = {
  [CardType.Two]: 2,
  [CardType.Three]: 3,
  [CardType.Four]: 4,
  [CardType.Five]: 5,
  [CardType.Six]: 6,
  [CardType.Seven]: 7,
  [CardType.Eight]: 8,
  [CardType.Nine]: 9,
  [CardType.Ten]: 10,
  [CardType.Jack]: 11,
  [CardType.Queen]: 12,
  [CardType.King]: 13,
  [CardType.Ace]: 14,
  [CardType.Joker]: -1,
}

export const suitIcon: Record<CardSuit, string> = {
  [CardSuit.Clubs]: '♣',
  [CardSuit.Diamonds]: '♦',
  [CardSuit.Spades]: '♠',
  [CardSuit.Hearts]: '♥',
}
