import { DefaultCardValues } from '../Base/DeckEnum'
import { CardSuit, CardType, suitIcon } from './DeckEnums'

// export interface Card {
//   assetPath: () => string
//   color: 'red' | 'black' | undefined
//   frontAssetPath: string
//   fullName: string
//   id: string
//   isHidden: boolean
//   name: string
//   renderOpacity: number
//   shortName: string
//   suit?: CardSuit
//   suitIcon: string
//   type: CardType
//   value: number
// }

export type Card = ReturnType<typeof createCard>

interface CardOptions {
  fullName?: string
  isHidden?: boolean
  name?: string
  suit?: CardSuit
  type: CardType
  value?: number
}

const CARD_BACK_ASSET = '/assets/cards/card_back.svg'

export const createCard = ({
  fullName,
  isHidden,
  name,
  suit,
  type,
  value,
}: CardOptions) => {
  const isSpecialCard = !(type >= 1 && type <= 9)
  const shortSuit = CardSuit[suit]?.slice(0, 1) || ''
  const shortName = isSpecialCard ? name.slice(0, 1) : value.toString()
  const frontAssetPath = `/assets/cards/${
    isSpecialCard ? `${shortName}${shortSuit}` : `${value}${shortSuit}`
  }`

  return {
    assetPath(hide?: boolean) {
      return (hide !== undefined ? hide : this.isHidden)
        ? CARD_BACK_ASSET
        : `${frontAssetPath}.svg`
    },
    color: [CardSuit.Hearts, CardSuit.Diamonds].includes(suit)
      ? 'red'
      : 'black',
    flip(hide?: boolean) {
      this.isHidden = hide !== undefined ? hide : !this.isHidden
    },
    frontAssetPath,
    fullName: fullName || name || CardType[type],
    id: `${type}${suit}${value}`,
    isHidden: Boolean(isHidden),
    name: name || CardType[type],
    renderOpacity: 1,
    shortName,
    smallAssetPath(hide?: boolean) {
      return (hide !== undefined ? hide : this.isHidden)
        ? CARD_BACK_ASSET
        : `${frontAssetPath}_small.svg`
    },
    suit: suit,
    suitIcon: suitIcon[suit] || ' ',
    type: type,
    value: value || DefaultCardValues[type],
  }
}
