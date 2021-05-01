import { stripIndent } from 'common-tags'
import { MessageAttachment } from 'discord.js'

import { Emoji } from '../../Data/Emoji'
import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { getChoice, messageFilter, reactionFilter } from '../../utils'
import { createCardCanvas } from '../Base/CardCanvas'
import { Bussen } from './Bussen'
import { Button } from './Button'
import { RoundFn } from './RoundUtils'

const setupBus = async (bussen: Bussen) => {
  bussen.deck.shuffle()
  const players = [...bussen.filterPlayers(bussen.protectedPassenger)]

  const passenger = players.reduce((a, b) =>
    a.cards.length > b.cards.length ||
    (a.cards.length === b.cards.length &&
      Math.max(...a.cards.map(c => c.value)) >
        Math.max(...b.cards.map(c => c.value)))
      ? a
      : b,
  )
  bussen.passenger = passenger

  bussen.players.filter(p =>
    [bussen.protectedPassenger?.id, bussen.dealer.id].includes(p.id),
  )

  const content = new MessageEmbed().setTitle(`[Round 6] Bus setup`)
    .setDescription(stripIndent`
    **beep beep**  ${Emoji.OncomingBus}  the bus has arrived!
     
    ${bussen.dealer.tag} is the bus driver and is here to pick up ${passenger.name}
    
    Click ${Button.Hide} to hide the bus.
    
    Please type a number between 1-10 to select how long the bus should be.
  `)

  const message = await bussen.channel.send(content)
  message.react(Button.Yes).then(() => message.react(Button.Hide))

  const messageCollector = bussen.channel
    .createMessageCollector(
      messageFilter({ byUser: bussen.dealer.id, isInRange: [1, 10] }),
    )
    .on('collect', msg => {
      console.log(msg.content, Number(msg.content) || 0)
      bussen.busSize = Number(msg.content) || 0
      content.editField('Bus length', bussen.busSize, true)
      message.edit(content)
    })

  const reactionCollector = message
    .createReactionCollector(reactionFilter([Button.Hide], bussen.dealer.id))
    .on('collect', () => {
      bussen.busHidden = true
      content.editField('Hidden', `${Emoji.MonkeySeeNoEvil} Yes`, true)
      message.edit(content)
    })
    .on('remove', () => {
      bussen.busHidden = false
      content.editField('Hidden', `${Emoji.MonkeyFace} No`, true)
      message.edit(content)
    })

  await message.awaitReactions(
    reactionFilter(Button.Yes, bussen.dealer.id, () => bussen.busSize > 0),
    {
      max: 1,
    },
  )

  bussen.busCards = new Array(bussen.busSize)
    .fill(0)
    .map(() => bussen.deck.draw(bussen.busHidden))

  reactionCollector.stop()
  messageCollector.stop()
  message.delete()
}

export const initBusRound: RoundFn = async bussen => {
  await setupBus(bussen)
  busRound(bussen)
}

export const busRound: RoundFn = async bussen => {
  bussen.busCards.forEach(c => (c.renderOpacity = 0.5))
  const row = bussen.busCards
  const busCard = bussen.busCards[bussen.busStep]
  busCard.renderOpacity = 1
  const buffer = await createCardCanvas(row)

  const driver = bussen.dealer
  const passenger = bussen.passenger

  const content = new MessageEmbed()
    .setTitle(
      `[Round 6] Bus ride - Driver \`${driver.name}\` / Passenger \`${passenger.name}\``,
    )
    .attachFiles([new MessageAttachment(buffer, 'bus.png')])
    .setImage('attachment://bus.png')
    .setDescription(
      `${passenger.tag}, will the next card be \`higher\` or \`lower\` ${
        busCard.isHidden ? '' : `than ${busCard.fullName}${busCard.suitIcon}`
      }`,
    )

  const drawnCard = bussen.deck.draw()

  const message = await bussen.channel.send(content)
  message.react(Button.Higher).then(() => message.react(Button.Lower))

  const choice = getChoice(
    await message.awaitReactions(
      reactionFilter([Button.Higher, Button.Lower], passenger.id),
      { max: 1 },
    ),
  )

  if (
    (choice === Button.Higher && drawnCard.value > busCard.value) ||
    (choice === Button.Lower && drawnCard.value < busCard.value)
  ) {
    bussen.busStep++
    content
      .setColor('DARK_GREEN')
      .setTitle(`[Round 6] ${passenger.name}'s move`)
      .setThumbnail(`http://aldertvaandering.com${drawnCard.assetPath}`)
      .editField(
        'Overview',
        `${passenger.tag} correctly guessed the next card would be ${
          choice === Button.Higher ? '`higher`' : '`lower'
        }`,
      )
      .editField('Mistakes made', bussen.busMistakes, true)
      .editField('Shots taken this ride', bussen.busShots, true)
    await message.edit(content)
  } else {
    const shots = bussen.busStep + 1
    bussen.drink(shots, passenger)
    bussen.busShots += shots

    content
      .setColor('RED')
      .setTitle(
        `[Round 6] ${passenger.name}'s move ${Emoji.TumblerGlass.repeat(
          shots,
        )}`,
      )
      .setThumbnail(`http://aldertvaandering.com${drawnCard.assetPath}`)
      .editField(
        'Overview',
        `${passenger.tag} incorrectly guessed the next card would be ${
          choice === Button.Higher ? '`higher`' : '`lower'
        } and has to drink ${shots} shot${shots > 1 ? 's' : ''}`,
      )
      .editField('Mistakes made', bussen.busMistakes, true)
      .editField('Shots taken this ride', bussen.busShots, true)

    await message.edit(content)
    bussen.busStep = 0
  }

  const step = bussen.busStep
  bussen.busCards = [
    ...bussen.busCards.slice(0, step),
    drawnCard,
    ...bussen.busCards.slice(step + 1, bussen.busCards.length),
  ]
  busCard.flip(true)

  if (bussen.busStep >= row.length) {
    const shots = bussen.busMistakes
    const content = new MessageEmbed()
      .setTitle(`${passenger.name} got off the bus!`)
      .setDescription(
        shots > 20
          ? `and with ${shots} shots is probably completely wasted`
          : shots > 10
          ? `and with ${shots} shots`
          : 'and got off flawlessly',
      )
      .attachFiles([new MessageAttachment('./assets/gifs/stumbling_drunk.gif')])
      .setImage('attachment://stumbling_drunk.gif')
    bussen.channel.send(content)
  } else {
    busRound(bussen)
  }
}
