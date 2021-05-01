import { Emoji } from '../../Data/Emoji'
import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { getChoice, reactionFilter } from '../../utils'
import { Card } from '../Base/Card'
import { Player } from '../Base/CardGame'
import { Bussen } from './Bussen'
import { renderMove } from './RenderMove'

export type RoundFn = (bussen: Bussen) => void | Promise<void>

interface CreateRoundCard {
  avatar: string
  description: string
  roundNr: number
}

export const createRoundCard = ({
  avatar,
  description,
  roundNr,
}: CreateRoundCard) =>
  new MessageEmbed()
    .setTitle(`[Round ${roundNr}]`)
    .setColor('AQUA')
    .setImage(avatar)
    .setDescription(description)

interface CreateRound {
  bussen: Bussen
  choices: Emoji[]
  correctGuessCondition: (choice: string, card: Card) => boolean
  description: string
  drinkAmount: number
  player: Player
  roundNr: number
}

export const createRound = async ({
  bussen,
  choices,
  correctGuessCondition,
  description,
  drinkAmount = 1,
  player,
  roundNr,
}: CreateRound) => {
  const content = createRoundCard({
    avatar: player.avatar,
    description,
    roundNr,
  })

  bussen.updatePlayerFields(content)

  const message = await bussen.channel.send(content)
  for (const choice of choices) {
    message.react(choice)
  }

  const choice = getChoice(
    await message.awaitReactions(reactionFilter(choices, player.id), {
      max: 1,
    }),
  )
  const card = bussen.playerDrawCard()
  const correctGuess = correctGuessCondition(choice, card)

  renderMove({
    bussen,
    cards: [card],
    choice,
    content,
    correctGuess,
    drinkAmount,
    player: bussen.currentPlayer,
    roundNr,
  })

  await message.edit(content)
}
