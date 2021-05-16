import { Collection, Message, MessageReaction, User } from 'discord.js'
import fetch from 'node-fetch'
import { add, defaultTo, lensPath, max, over, pipe } from 'ramda'

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

type CodeLanguage =
  | 'asciidoc'
  | 'autohotkey'
  | 'bash'
  | 'coffeescript'
  | 'cpp'
  | 'cs'
  | 'css'
  | 'diff'
  | 'fix'
  | 'glsl'
  | 'ini'
  | 'json'
  | 'md'
  | 'ml'
  | 'prolog'
  | 'py'
  | 'tex'
  | 'xl'
  | 'xml'

export const formatCode = (str: string, language: CodeLanguage = 'asciidoc') =>
  `\`\`\`${language}\n${str}\`\`\``

// Using the modern version of the Fisher–Yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
export const shuffleArray = <T = unknown>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

export const DEV_ID = '158931684526391296'
export const isDeveloper = (playerId: string) => isDev() && playerId === DEV_ID
export const isDev = () => process.env.NODE_ENV === 'development'

export const getRandomElement = <T = unknown>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)]

export const reactionFilter = (
  emoji: Emoji | Emoji[] | null,
  userId?: string | string[],
  extraCondition?: boolean | (() => boolean),
  includeBots?: boolean,
) => (reaction: MessageReaction, reactionUser: User) => {
  let emojiCondition = true
  if (Array.isArray(emoji)) {
    emojiCondition = emoji.includes(reaction.emoji.name as Emoji)
  } else if (emoji !== null) {
    emojiCondition = emoji === reaction.emoji.name
  }

  let userCondition
  if (isDeveloper(reactionUser.id)) {
    userCondition = true
  } else if (Array.isArray(userId)) {
    userCondition = userId.includes(reactionUser.id)
  } else {
    userCondition = userId ? userId === reactionUser.id : true
  }

  return (
    userCondition &&
    emojiCondition &&
    (typeof extraCondition === 'function'
      ? extraCondition()
      : extraCondition !== undefined
      ? extraCondition
      : true) &&
    (includeBots ? true : !reactionUser.bot)
  )
}

interface MessageFilterParams {
  byUser?: string | string[]
  isInRange?: [min: number, max: number]
  isNumber?: boolean
}
export const messageFilter = (params: MessageFilterParams = {}) => (
  msg: Message,
) => {
  const {
    byUser,
    isNumber = Array.isArray(params.isInRange),
    isInRange,
  } = params

  const asNumber = Number(msg.content)
  const [min, max] = isInRange || []

  let userCondition
  if (Array.isArray(byUser)) {
    userCondition = isDeveloper(msg.author.id) || byUser.includes(msg.author.id)
  } else {
    userCondition =
      isDeveloper(msg.author.id) || (byUser && msg.author.id === byUser)
  }

  return (
    userCondition &&
    (isNumber === true
      ? !isNaN(asNumber)
      : isNumber === false
      ? isNaN(asNumber)
      : true) &&
    (Array.isArray(isInRange) ? asNumber >= min && asNumber <= max : true)
  )
}

export const getChoice = (collected: Collection<string, MessageReaction>) =>
  collected.first().emoji.name

export const addValueToPath = <T extends Record<string, unknown>>(obj: T) => (
  amount: number,
  path: string[],
) => over(lensPath<T>(path), pipe(defaultTo(0), add(amount), max(0)))(obj)
