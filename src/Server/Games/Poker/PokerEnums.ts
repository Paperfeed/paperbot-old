import { Emoji } from '../../Data/Emoji'

export const PokerBtn = {
  Call: Emoji.SquaredCheck,
  Fold: Emoji.Cross,
  Raise: Emoji.ArrowUp,
}

export enum PokerAction {
  Check,
  Call,
  Raise,
  Fold,
  Bet,
}
