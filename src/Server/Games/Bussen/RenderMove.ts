import { MessageAttachment } from 'discord.js'

import { Emoji } from '../../Data/Emoji'
import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { Card } from '../Base/Card'
import { createCardCanvas } from '../Base/CardCanvas'
import { Player } from '../Base/CardGame'
import { Bussen } from './Bussen'
import { Button } from './Button'

interface RenderMove {
  bussen: Bussen
  cards: Card[]
  choice: string
  content: MessageEmbed
  correctGuess: boolean
  drinkAmount?: number
  player: Player
  roundNr: number
}

export const renderMove = async ({
  bussen,
  choice,
  content,
  correctGuess,
  drinkAmount = 1,
  player,
  roundNr,
}: RenderMove) => {
  const { cards: playerCards, lastDrawnCard, name } = player
  const secondToLastCard =
    playerCards.length >= 2 ? playerCards[playerCards.length - 2] : undefined

  const len = playerCards.length - 1
  const lastTwoCards = [playerCards[len - 2], playerCards[len - 1]].sort(
    (a, b) => a.value - b.value,
  )

  let overviewString
  const guessString = correctGuess ? 'correctly' : 'incorrectly'

  switch (roundNr) {
    case 1:
      overviewString = `${name} ${guessString} guessed the next card would be \`${
        choice === Button.Red ? 'red' : 'black'
      }\``
      break
    case 2:
      overviewString = `${name} ${guessString} guessed the next card would be \`${
        choice === Button.Higher ? 'higher' : 'lower'
      }\``

      break
    case 3:
      overviewString = `${name} ${guessString} guessed the next card would be \`${
        choice === Button.Yes ? 'in between' : 'outside of'
      }\` ${lastTwoCards[0].shortName} and ${lastTwoCards[1].shortName}`
      break
    case 4:
      overviewString = `${name} ${guessString} guessed the next card ${
        choice === Button.Rainbow
          ? 'would finish their set 🌈🌈🌈'
          : choice === Button.Yes
          ? '`would` be part of existing suits in their deck'
          : '`would not` be part of existing suits in their deck'
      }`
      break
  }

  if (correctGuess) {
    content.setColor('DARK_GREEN')
  } else {
    content.setColor('RED')
    overviewString += ` and has to drink ${drinkAmount} shot${
      drinkAmount > 1 ? 's' : ''
    }`
    bussen.drink(drinkAmount)
  }

  content
    .setTitle(
      `[Round ${roundNr}] - ${name}'s move ${
        correctGuess ? '' : Emoji.TumblerGlass.repeat(drinkAmount)
      }`,
    )
    .setFooter('')

  const drawnCardBuffer = await createCardCanvas(lastDrawnCard)
  content
    .attachFiles([new MessageAttachment(drawnCardBuffer, 'lastDrawnCard.png')])
    .setImage(`attachment://lastDrawnCard.png`)

  if (secondToLastCard) {
    const secondToLastCardBuffer = await createCardCanvas(secondToLastCard)
    content
      .attachFiles([
        new MessageAttachment(secondToLastCardBuffer, 'secondToLastCard.png'),
      ])
      .setThumbnail(`attachment://secondToLastCard.png`)
  }

  content.fields = [
    secondToLastCard
      ? {
          inline: false,
          name: 'Previous card',
          value: `${secondToLastCard.fullName}${secondToLastCard.suitIcon}`,
        }
      : undefined,
    {
      inline: true,
      name: 'Overview',
      value: overviewString,
    },
    {
      inline: false,
      name: 'Drink tally',
      value: bussen.drinksToStringArray().join('\n') || 'No drinks yet',
    },
  ].filter(Boolean)
}
