import { Player } from '../Base/CardGame'

export enum Event {
  FinishedDispatchingDrinks,
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface EventFn extends Record<Event, Function> {
  [Event.FinishedDispatchingDrinks]: (player: Player) => void
}
