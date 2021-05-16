import { Bussen } from '../Games/Bussen/Bussen'
import { Command } from './index'

export const bussen = {
  fn: async function (prefix, msg) {
    this.games.push(new Bussen(this, msg))
  },
  matcher: (prefix, msg) => msg.content.startsWith(`${prefix}bussen`),
  stopPropagation: true,
} as Command
