import { Bussen } from '../Games/Bussen/Bussen'
import { Command } from './index'

export const bussen = {
  fn: async function (msg) {
    new Bussen(this, msg)
  },
  matcher: msg => msg.content.startsWith('!bussen'),
  stopPropagation: true,
} as Command
