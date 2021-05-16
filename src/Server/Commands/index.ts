import { Message } from 'discord.js'

import { Paperbot } from '../Paperbot'

export { bussen } from './bussen'
export { invite } from './invite'
export { paper } from './paper'
export { register } from './register'
export { stats } from './stats'

export interface Command {
  fn: (
    this: Paperbot,
    prefix: string,
    msg: Message,
    parameters: RegExpMatchArray,
  ) => void | Promise<void>
  matcher: (this: Paperbot, prefix: string, msg: Message) => boolean | RegExp
  parameterMatcher?: (msgContent: string) => string[]
  stopPropagation?: boolean
}
