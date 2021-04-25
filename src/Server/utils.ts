import { Message } from 'discord.js'
import fetch from 'node-fetch'

import { Emoji } from './Data/Emoji'

export async function fetchAsync<T>(url: string): Promise<T> {
  const result = await fetch(url)
  return await result.json()
}

export const UrlBuildParams = (obj: Record<string, string>) =>
  Object.entries(obj)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&')

export const ifArrayGetFirstItem = <T = unknown>(a: T[] | undefined) =>
  a && a.length ? a[0] : undefined

export class EmojiHelper {
  static addReactions = async (emojis: (Emoji | string)[], msg: Message) => {
    for (const emoji of emojis) {
      await msg.react(emoji)
    }
  }
}

type ValueOf<T> = T[keyof T]

export class Enum {
  public static keys<T extends Record<string, string | number>>(obj: T) {
    return Object.keys(obj).filter(i =>
      isNaN(Number(i)),
    ) as (keyof typeof obj)[]
  }

  public static values<T extends Record<string, string | number>>(obj: T) {
    return Object.keys(obj)
      .filter(i => isNaN(Number(i)))
      .map(key => obj[key]) as ValueOf<T>[]
  }

  public static entries<T extends Record<string, string | number>>(obj: T) {
    return Object.keys(obj)
      .filter(i => isNaN(Number(i)))
      .map(key => [key, obj[key]]) as [keyof typeof obj, ValueOf<T>][]
  }
}
