import { oneLineCommaListsAnd, stripIndent } from 'common-tags'
import { Message, MessageAttachment } from 'discord.js'
import { apply, sortBy } from 'ramda'

import { Emoji, EmojiNumber, emojiNumberToNumber } from '../../Data/Emoji'
import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { isDeveloper, messageFilter, reactionFilter } from '../../utils'
import { Card } from '../Base/Card'
import { createCardCanvas } from '../Base/CardCanvas'
import { Player } from '../Base/CardGame'
import { Button } from './Button'
import { Event } from './Events'
import { RoundFn } from './RoundUtils'

const setupPyramid: RoundFn = async bussen => {
  const player = bussen.currentPlayer
  let pyramidSize = 0

  const pyramidSelectionCard = new MessageEmbed().setTitle(
    `[Round 5] Select pyramid size`,
  ).setDescription(stripIndent`
      ${player.tag}, type any number between 1-10 to decide how wide the pyramid should be.
      
      Click on ${Button.Reverse} to reverse the pyramid.
      
      Each player can add one chug card to the end of the pyramid by clicking on ${Button.Chug}.
    `)

  const pyramidMessage = await bussen.channel.send(pyramidSelectionCard)

  pyramidMessage
    .react(Button.Reverse)
    .then(() => pyramidMessage.react(Button.Chug))
    .then(() => pyramidMessage.react(Button.Yes))

  pyramidMessage
    .createReactionCollector(
      reactionFilter([Button.Reverse, Button.Chug], player.id),
      {
        dispose: true,
      },
    )
    .on('collect', reaction => {
      if (reaction.emoji.name === Button.Reverse) {
        bussen.pyramidReversed = true
        pyramidSelectionCard.editField(
          'Reversed',
          Emoji.SquaredCheck,
          true,
          pyramidMessage,
        )
      } else {
        bussen.pyramidChugRule++
        pyramidSelectionCard.editField(
          'Chug last row',
          Emoji.SquaredCheck,
          true,
          pyramidMessage,
        )
      }
    })
    .on('remove', reaction => {
      if (reaction.emoji.name === Button.Reverse) {
        bussen.pyramidReversed = false
        pyramidSelectionCard.editField(
          'Reversed',
          Emoji.SquaredCross,
          true,
          pyramidMessage,
        )
      } else {
        bussen.pyramidChugRule = Math.max(bussen.pyramidChugRule - 1, 0)
        pyramidSelectionCard.editField(
          'Chug last row',
          bussen.pyramidChugRule ? Emoji.SquaredCheck : Emoji.SquaredCross,
          true,
          pyramidMessage,
        )
      }
    })

  // Collect messages and match those that set the pyramid size
  const collector = bussen.channel
    .createMessageCollector(
      messageFilter({ byUser: player.id, isInRange: [1, 10] }),
    )
    .on('collect', async (message: Message) => {
      pyramidSelectionCard.editField('Size', message.content, true)
      pyramidSize = Number(message.content)
      await pyramidMessage.edit(pyramidSelectionCard)
      await message
        .delete()
        .catch(() => console.log('Failed to delete message - [No permissions]'))
    })

  await pyramidMessage.awaitReactions(
    reactionFilter(Button.Yes, player.id, () => pyramidSize > 0),
    { max: 1 },
  )
  collector.stop()
  pyramidMessage.delete()

  // const totalCards = (pyramidSize * (pyramidSize + 1)) / 2
  const rows: Card[][] = []

  for (let i = 0; i < pyramidSize; i++) {
    const arr = new Array(i + 1).fill(0)
    rows.push(arr.map(() => bussen.deck.draw().flip()))
  }

  if (!bussen.pyramidReversed) rows.reverse()
  if (bussen.pyramidChugRule) {
    pyramidSize++
    const arr = new Array(bussen.pyramidChugRule).fill(0)
    rows.push(arr.map(() => bussen.deck.draw().flip()))
  }

  bussen.pyramid = rows
}

export const pyramidRound: RoundFn = async bussen => {
  /*
    First setup the pyramid, how many columns, whether it is reversed, last row should be a chug row, etc.
   */
  if (bussen.pyramid === undefined) {
    await setupPyramid(bussen)
  }

  const currentRow = bussen.pyramid[bussen.pyramidRow]
  const isChugRow =
    bussen.pyramidChugRule && bussen.pyramidRow == bussen.pyramid.length - 1

  if (currentRow === undefined) {
    bussen.setRound(6)
    return
  }

  currentRow.map(c => c.flip(true))

  // Render the entire pyramid to a canvas buffer so we can attach it to a message embed
  const [firstRow, ...rest] = bussen.pyramid
  const buffer = await createCardCanvas(firstRow, ...rest)

  /*
   This holds the players that have cards that can be laid down on the pyramid
   and whether or not they have been
   */
  const validCardMap = new Map<
    Player,
    { card: Card; hasBeenPicked: boolean }[]
  >()
  bussen.players.forEach(player => {
    const validCards: { card: Card; hasBeenPicked: boolean }[] = []
    player.cards.forEach(card => {
      currentRow.forEach(pyramidCard => {
        if (pyramidCard.value === card.value) {
          validCards.push({ card, hasBeenPicked: false })
        }
      })
    })
    if (validCards.length) validCardMap.set(player, validCards)
  })

  const content = new MessageEmbed()
    .setTitle(
      `[Round 5] ${
        bussen.pyramidReversed ? 'Reversed pyramid' : 'Pyramid'
      } row ${bussen.pyramidRow + 1}  /  ${bussen.pyramidRow + 1} ${
        isChugRow ? Emoji.Beer : Emoji.TumblerGlass
      } per card`,
    )
    .attachFiles([new MessageAttachment(buffer, `table.png`)])
    .setImage(`attachment://table.png`)
    .addField(
      'Cards in hand',
      bussen.players.map(p => `${p.tag} - ${p.cards.length}`),
      true,
    )
    .addField(
      'Drink tally',
      bussen.drinksToStringArray().join('\n') || 'No drinks yet',
      true,
    )

  if (validCardMap.size > 0) {
    const playersWithValidCards = sortBy(
      ([item]) => item.name,
      Array.from(validCardMap),
    )
    const playerIds = playersWithValidCards.map(([p]) => p.id)

    content.setColor('DARK_GREEN').setDescription(
      stripIndent`
      ${oneLineCommaListsAnd`${playersWithValidCards.map(
        ([p]) => p.tag,
      )}`}, you have valid cards.
      
      Click or type the number in front of the card you want to place or click ${
        Button.Yes
      } to continue`,
    )

    playersWithValidCards.forEach(([player, data]) =>
      content.addField(
        player.name,
        `${data
          .map((d, index) => `${++index}. ${d.card.fullName}${d.card.suitIcon}`)
          .join('\n')}`,
        false,
      ),
    )

    const largestAmountOfValidCards = apply(Math.max)(
      playersWithValidCards.map(([, c]) => c.length),
    )
    const readyPlayers = new Map()

    const pyramidRowMessage = await bussen.channel.send(content)
    const cardSelectionMessageCollector = bussen.channel.createMessageCollector(
      messageFilter({ byUser: playerIds, isNumber: true }),
    )
    pyramidRowMessage.react(Button.Yes)
    for (let i = 1; i <= largestAmountOfValidCards; i++) {
      pyramidRowMessage.react(EmojiNumber[i])
    }

    const readyCheckReactionCollector = pyramidRowMessage.createReactionCollector(
      reactionFilter([Button.Yes], playerIds),
    )

    const cardSelectionReactionCollector = pyramidRowMessage.createReactionCollector(
      reactionFilter(
        Object.keys(EmojiNumber).map(key => EmojiNumber[Number(key)]),
        playerIds,
      ),
    )
    let finishDrinkEvent

    await new Promise<void>(async resolve => {
      const setReady = (playerId: string) => {
        readyPlayers.set(playerId, true)
        if (readyPlayers.size === playerIds.length || isDeveloper(playerId)) {
          resolve()
        }
      }

      const selectCard = async (playerId: string, number: number) => {
        console.log(`Player chose card ${number}`)
        const player = bussen.getPlayerById(playerId)
        const validCards = validCardMap.get(player)
        const chosenCard = validCards[number - 1]

        if (chosenCard && !chosenCard.hasBeenPicked) {
          chosenCard.hasBeenPicked = true
          bussen.removeCardFromPlayer(chosenCard.card, player)
          validCardMap.set(player, validCards)

          const cardString = `${validCards
            .map(
              (d, index) =>
                `${d.hasBeenPicked ? '~~' : ''}${++index}. ${d.card.fullName}${
                  d.card.suitIcon
                }${d.hasBeenPicked ? '~~' : ''}`,
            )
            .join('\n')}`

          content
            .editField(player.name, validCards.length ? cardString : '-')
            .editField(
              'Cards in hand',
              bussen.players.map(p => `${p.tag} - ${p.cards.length}`),
            )

          await pyramidRowMessage.edit(content)

          bussen.addDispensableDrinks(
            isChugRow ? 1 : bussen.pyramidRow + 1,
            player,
            isChugRow,
          )
          bussen.createDrinkDispenseCard(player, isChugRow)

          if (
            validCards.every(d => d.hasBeenPicked) &&
            !Boolean(bussen.dispensableDrinks[player.id])
          ) {
            setReady(player.id)
          }
        }
      }

      finishDrinkEvent = bussen.on(Event.FinishedDispatchingDrinks, player => {
        const validCards = validCardMap.get(player)
        if (
          !bussen.playerHasDrinks(player.id) &&
          validCards.every(c => c.hasBeenPicked)
        ) {
          setReady(player.id)
        }
      })

      cardSelectionMessageCollector.on('collect', (msg: Message) => {
        selectCard(msg.author.id, Number(msg.content))
      })

      cardSelectionReactionCollector.on('collect', (reaction, user) => {
        selectCard(user.id, emojiNumberToNumber(reaction.emoji.name))
      })

      readyCheckReactionCollector.on('collect', (reaction, user) => {
        if (bussen.playerHasDrinks(user.id)) {
          const content = new MessageEmbed()
            .setColor('ORANGE')
            .setDescription(`<@${user.id}>, you still have shots to dispense`)
          bussen.channel.send(content)
        } else {
          setReady(user.id)
        }
      })
    })

    bussen.off(Event.FinishedDispatchingDrinks, finishDrinkEvent)
    readyCheckReactionCollector.stop()
    cardSelectionReactionCollector.stop()
    cardSelectionMessageCollector.stop()
  } else {
    content
      .setColor('RED')
      .setDescription('No players can make a move this row, moving on')
      .removeField('Cards in hand')
      .removeField('Drink tally')

    await bussen.channel.send(content)
  }

  bussen.pyramidRow++
}
