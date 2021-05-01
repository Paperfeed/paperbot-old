import { Message } from 'discord.js'

import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { Paperbot } from '../../Paperbot'
import { reactionFilter, shuffleArray } from '../../utils'
import { Card } from '../Base/Card'
import { Player } from '../Base/CardGame'
import { Deck } from '../Base/Deck'
import { DrinkCardGame } from '../Base/DrinkCardGame'
import { initBusRound } from './Bus'
import { Button } from './Button'
import { roundFour, roundOne, roundThree, roundTwo } from './FirstRounds'
import { pyramidRound } from './Pyramid'

export class Bussen extends DrinkCardGame {
  pyramidReversed = false
  pyramidChugRule = 0
  pyramid: Card[][] | undefined
  pyramidRow = 0
  protectedPassenger: Player | undefined
  passenger: Player
  busSize = 0
  busCards: Card[]
  busHidden = false
  busStep = 0
  busMistakes = 0
  busShots = 0

  constructor(paperBot: Paperbot, msg: Message) {
    super()
    this.paperBot = paperBot
    this.channel = msg.channel
    this.initiateGame(msg)
  }

  private initiateGame = async (msg: Message) => {
    // For lonely debug purposes :(
    // if (isDev()) {
    //   let i = 0
    //   const members = await msg.guild.members.fetch()
    //   members.forEach(gm => {
    //     if (
    //       gm.user.username !== 'Paperbot' &&
    //       gm.user.username === 'Aldert' &&
    //       i < 1
    //     ) {
    //       this.addPlayer(gm.user)
    //       i++
    //     }
    //   })
    //
    //   this.round = 6
    //   this.startGame()
    //   return
    // }

    const messageContent = new MessageEmbed()
      .setTitle(`${msg.author.username} wants to start a round of Bussen`)
      .setDescription(
        `Click on ${Button.Join} to join and ${Button.Start} to start`,
      )
    const reply = await msg.reply(messageContent)
    reply.react(Button.Join).then(() => reply.react(Button.Start))

    const updatePlayerList = () => {
      if (this.players.length) {
        messageContent.fields = [
          {
            inline: true,
            name: 'Players',
            value: this.players.map(p => p.tag).join('\n'),
          },
        ]
      } else {
        messageContent.fields = undefined
      }
      reply.edit(messageContent)
    }

    reply
      .createReactionCollector(reactionFilter(Button.Join), { dispose: true })
      .on('collect', (_reaction, user) => {
        this.addPlayer(user)
        updatePlayerList()
      })
      .on('remove', (_reaction, user) => {
        this.removePlayer(user)
        updatePlayerList()
      })

    await reply.awaitReactions(
      reactionFilter(
        Button.Start,
        msg.author.id,
        () => this.players.length > 0,
      ),
      {
        max: 1,
      },
    )
    reply.delete()

    shuffleArray(this.players)

    return this.startGame()
  }

  private startGame = async () => {
    this.dealer = this.pickRandomPlayer(this.previousDealer)
    this.setCurrentPlayer(this.dealer)
    this.deck = new Deck({ unlimited: true })
    this.deck.shuffle()

    // if (isDev()) {
    //   this.setRound(6)
    //   this.players.map(p => {
    //     p.cards = this.deck.drawMultiple(12)
    //   })
    // } else {
    //   this.setRound(1)
    // }

    return this.playRound()
  }

  private quitGame = () => {
    this.paperBot.games = this.paperBot.games.filter(g => g !== this)
  }

  private playRound = async () => {
    switch (this.round) {
      case 1:
        await roundOne(this)
        return this.completeRound(2)
      case 2:
        await roundTwo(this)
        return this.completeRound(3)
      case 3:
        await roundThree(this)
        return this.completeRound(4)
      case 4:
        await roundFour(this)
        return this.completeRound(5)
      case 5:
        await pyramidRound(this)
        this.setCurrentPlayer(this.getNextPlayer())
        this.roundOrder++
        this.playRound()
        break
      case 6:
        await initBusRound(this)
        console.log('game finished')
    }
  }

  private resetGame = () => {
    this.previousDealer = this.dealer
    this.protectedPassenger = this.passenger
  }

  private completeRound = (nextRound: number) => {
    this.setCurrentPlayer(this.getNextPlayer())
    this.roundOrder++

    if (this.roundOrder >= this.players.length) {
      console.log(`Round ${this.round} finished`)
      this.setRound(nextRound)
    }
    this.playRound()
  }
}
