import { Message } from 'discord.js'

import { Paperbot } from '../Paperbot'

export { bussen } from './bussen'
export { help } from './help'
export { invite } from './invite'
export { register } from './register'

export interface Command {
  fn: (
    this: Paperbot,
    msg: Message,
    parameters: RegExpMatchArray,
  ) => void | Promise<void>
  matcher: (msg: Message) => boolean | RegExp
  parameterMatcher?: (msgContent: string) => string[]
  stopPropagation?: boolean
}
