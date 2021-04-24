import { Message } from 'discord.js'

import { Paperbot } from '../Paperbot'

export { help } from './help'
export { register } from './register'

export interface Command {
  fn: (this: Paperbot, msg: Message) => void | Promise<void>
  matcher: (msg: Message) => boolean | RegExp
  stopPropagation?: boolean
}
