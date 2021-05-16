import { stripIndent } from 'common-tags'
import { Message, MessageCollector } from 'discord.js'
import { IntlMessageFormat } from 'intl-messageformat'

import { MessageEmbed } from '../../Extensions/MessageEmbed'
import { addValueToPath, messageFilter } from '../../utils'
import { Event } from '../Bussen/Events'
import { CardGame, Player } from './CardGame'

export class DrinkCardGame extends CardGame {
  public drinkTally: Record<string, { chugs: number; drinks: number }> = {}
  public dispensableDrinks: Record<
    string,
    { chugs: number; drinks: number }
  > = {}
  private dispenseCardRecord: Record<string, Message> = {}

  public drink = (
    amount = 1,
    player: Player = this.currentPlayer,
    guildId?: string,
  ) => {
    const currentStats = this.drinkTally[player.id] || { chugs: 0, drinks: 0 }
    this.drinkTally = {
      ...this.drinkTally,
      [player.id]: {
        ...currentStats,
        drinks: currentStats.drinks + amount,
      },
    }
    this.paperBot.fauna.writeToStats(player.id, guildId, {
      drinks: amount,
    })
  }

  public chug = (
    amount = 1,
    player: Player = this.currentPlayer,
    guildId?: string,
  ) => {
    const currentStats = this.drinkTally[player.id] || { chugs: 0, drinks: 0 }
    this.drinkTally = {
      ...this.drinkTally,
      [player.id]: {
        ...currentStats,
        chugs: currentStats.chugs + amount,
      },
    }
    this.paperBot.fauna.writeToStats(player.id, guildId, {
      chugs: amount,
    })
  }

  public drinksToStringArray = () =>
    Object.keys(this.drinkTally)
      .map(id => {
        const player = this.getPlayerById(id)
        const { chugs, drinks } = this.drinkTally[id] || {}

        return drinks || chugs
          ? `${player.name}: ${
              drinks ? `${drinks} shot${drinks > 1 ? 's' : ''}` : ''
            }${drinks && chugs ? ' and ' : ''}${
              chugs ? `${chugs} chug${chugs > 1 ? 's' : ''}` : ''
            }`
          : undefined
      })
      .filter(Boolean)

  public giveShotToPlayer = (
    amount: number,
    receivingPlayer: Player,
    fromPlayer?: Player,
    isChug?: boolean,
    guildId?: string,
  ) => {
    const content = new MessageEmbed()
      .setColor('YELLOW')
      .setDescription(
        `${receivingPlayer.tag}, you have to drink ${amount} shot${
          amount > 1 ? 's' : ''
        } ${fromPlayer ? `from ${fromPlayer.name}` : ''}`,
      )
    this.channel.send(content)
    if (isChug) {
      this.chug(amount, receivingPlayer, guildId)
    } else {
      this.drink(amount, receivingPlayer, guildId)
    }
  }

  public playerHasDrinks = (playerId: string) => {
    const { chugs, drinks } = this.dispensableDrinks[playerId] || {}
    return drinks || chugs
  }

  public addDispensableDrinks = (
    amount: number,
    player: Player,
    isChug?: boolean,
  ) => {
    this.dispensableDrinks = addValueToPath(this.dispensableDrinks)(amount, [
      player.id,
      isChug ? 'chugs' : 'drinks',
    ])
  }

  public removeDispensableDrinks = (
    amount: number,
    player: Player,
    isChug?: boolean,
  ) => {
    this.dispensableDrinks = addValueToPath(this.dispensableDrinks)(-amount, [
      player.id,
      isChug ? 'chugs' : 'drinks',
    ])
  }

  public createDrinkDispenseCard = (player: Player, isChug?: boolean) => {
    const message = this.dispenseCardRecord[player.id]
    let collector: MessageCollector

    const type = isChug ? 'chugs' : 'drinks'
    const content = new MessageEmbed()
    const setMessageContent = () =>
      content
        .setDescription(
          new IntlMessageFormat(stripIndent`
            ${player.tag}, you have ${
            isChug
              ? '{amount, plural, =1 {# chug} other {# chugs}}'
              : '{amount, plural, =1 {# shot} other {# shots}}'
          } available.
            
            Type \`@username '{number}'\` to dispense your shots.
          `).format({ amount: this.dispensableDrinks[player.id][type] }),
        )
        .setFooter(
          'Tip: You can dispense shots to multiple players in one message',
        )
    setMessageContent()

    if (message) {
      message.edit(content)
    } else {
      collector = this.channel.createMessageCollector(
        messageFilter({ byUser: player.id }),
      )
      collector.on('collect', (msg: Message) => {
        const regExp = /<@!(.+?)> +?(\d+)/g
        let match, matched

        do {
          match = regExp.exec(msg.content)
          if (!match) break
          matched = true
          const [, id, amountString] = match
          const amount = Number(amountString)

          const receivingPlayer = this.getPlayerById(id)
          if (receivingPlayer && amount) {
            const calculatedAmount = Math.min(
              this.dispensableDrinks[player.id][type],
              amount,
            )
            this.giveShotToPlayer(
              calculatedAmount,
              receivingPlayer,
              player,
              isChug,
              msg.guild?.id,
            )
            this.removeDispensableDrinks(calculatedAmount, player)
          }
        } while (match)

        if (this.dispensableDrinks[player.id][type] <= 0) {
          collector.stop()
          this.dispenseCardRecord[player.id].delete()
          this.dispenseCardRecord[player.id] = undefined
          this.emit(Event.FinishedDispatchingDrinks, player)
        } else {
          setMessageContent()
          this.dispenseCardRecord[player.id].edit(content)
        }

        if (matched) msg.delete()
      })

      this.channel
        .send(content)
        .then(msg => (this.dispenseCardRecord[player.id] = msg))
    }
  }
}
