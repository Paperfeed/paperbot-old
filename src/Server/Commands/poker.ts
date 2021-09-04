import { stripIndent } from 'common-tags'
import { MessageAttachment } from 'discord.js'

import { MessageEmbed } from '../Extensions/MessageEmbed'
import { playPoker } from '../Games/Poker/Poker'
import { Command } from './index'

export const poker = {
  fn: async function (prefix, msg, parameters) {
    if (parameters.length > 1) {
      switch (parameters[1]) {
        case 'hands':
          const content = new MessageEmbed()
            .attachFiles([
              new MessageAttachment(
                'assets/imgs/poker_hands.png',
                'poker_hands.png',
              ),
            ])
            .setImage('attachment://poker_hands.png')
            .setDescription('')
            .setURL('https://www.thehendonmob.com/guide/texas-holdem/')
          msg.channel.send(
            stripIndent`
              A hand always consist of five cards. 
              
              Individual cards are ranked as from high-to-low: A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2. 
              
              _*Ace*_ can be low, but only when part of an \`A-2-3-4-5 straight\`. 
              Suits (_Club_, _Diamond_, _Heart_, _Spade_) have no value, so if two players have hands that are identical except for suit, they are tied. 
              
              A _Kicker_ card is a high card used to break ties between hands of the same rank (ex. 2 players with \`Four of a Kind\`. Both have K's on the board but player one has \`K, 9\` and player two has \`K, 6\`, so player one with \`K, 9\` wins with the _9 Kicker_.)
              
              **Royal Flush** - A, K, Q, J, 10, all in the same suit \`(1 in 650,000)\`
              **Straight Flush** - Five cards in sequence, all of the same suit \`(1 in 65,000)\`
              **Four of a Kind** - Four cards of one rank. Kicker breaks ties. \`(1 in 4,000)\`
              **Full House** - Three matching cards of one rank, plus Two matching cards of another rank. Higher ranking set of three wins. If two players have the same set of three, the player with the higher pair wins \`(1 in 700)\`
              **Flush** - Five cards of the same suit. High card wins \`(1 in 500)\`
              **Straight** - Five cards of sequential rank, but different suit. High card wins \`(1 in 250)\`
              **Three of a kind** - Three cards of the same rank, plus two unmatched cards. High set wins \`(1 in 50)\`
              **Two Pair** - _Two_ cards of the same rank, plus _Two_ cards of another rank. High pair wins \`(1 in 20)\`
              **One Pair** - _Two_ cards of the same rank, plus _Three_ unmatched cards. High pair wins \`(1 in 2 1/3)\`
              **High Card** - One card high, plus four unmatched lower ranking cards. Ace is the Highest card. Kicker breaks ties \`(1 in 1)\`
            `,
            content,
          )
      }
    } else {
      playPoker(this, msg)
    }
  },
  matcher: (prefix, msg) => msg.content.startsWith(`${prefix}poker`),
  stopPropagation: true,
} as Command
