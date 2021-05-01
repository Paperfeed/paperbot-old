import { Bussen } from '../Games/Bussen/Bussen'
import { Command } from './index'

export const bussen = {
  fn: async function (msg) {
    this.games.push(new Bussen(this, msg))
  },
  matcher: msg => msg.content.startsWith('!bussen'),
  stopPropagation: true,
} as Command
