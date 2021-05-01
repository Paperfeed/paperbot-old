import { getUniqueCardSuits } from '../Base/Card'
import { Button } from './Button'
import { createRound, RoundFn } from './RoundUtils'

//
// Round 1 - Will the next card be red or black?
//
export const roundOne: RoundFn = async function (bussen) {
  const player = bussen.currentPlayer

  await createRound({
    bussen,
    choices: [Button.Red, Button.Black],
    correctGuessCondition: (choice, card) =>
      (choice === Button.Red && card.color === 'red') ||
      (choice === Button.Black && card.color === 'black'),
    description: `${player.tag}, will your next card be \`red\` or \`black\`?`,
    drinkAmount: 1,
    player,
    roundNr: 1,
  })
}

//
// Round 2 - Will the next card be higher or lower?
//
export const roundTwo: RoundFn = async function (bussen) {
  const player = bussen.currentPlayer
  const { lastDrawnCard } = player

  await createRound({
    bussen,
    choices: [Button.Higher, Button.Lower],
    correctGuessCondition: (choice, card) =>
      (choice === Button.Lower && card.value < lastDrawnCard.value) ||
      (choice === Button.Higher && card.value > lastDrawnCard.value),
    description: `${player.tag}, will your next card be \`higher\` or \`lower\` than ${lastDrawnCard.fullName}${lastDrawnCard.suitIcon}?`,
    drinkAmount: 1,
    player,
    roundNr: 2,
  })
}

//
// Round 3 - Does the next card fall between the two previously drawn cards?
//
export const roundThree: RoundFn = async function (bussen) {
  const player = bussen.currentPlayer
  const [cardOne, cardTwo] = player.cards.sort((a, b) => a.value - b.value)

  if (!cardOne || !cardTwo) {
    throw new Error(
      "Player doesn't have two cards! This should not be possible",
    )
  }

  await createRound({
    bussen,
    choices: [Button.Yes, Button.No],
    correctGuessCondition: (choice, card) =>
      (choice === Button.Yes &&
        card.value >= cardOne.value &&
        card.value <= cardTwo.value) ||
      (choice === Button.No &&
        (card.value < cardOne.value || card.value > cardTwo.value)),
    description: `${player.tag}, will your next card between ${cardOne.shortName}${cardOne.suitIcon} and ${cardTwo.shortName}${cardTwo.suitIcon}?`,
    drinkAmount: 1,
    player,
    roundNr: 3,
  })
}

//
// Round 4 - Does player already have the next card's suit?
//
export const roundFour: RoundFn = async function (bussen) {
  const player = bussen.currentPlayer

  const { cards } = player
  const choices =
    getUniqueCardSuits(player.cards).length === 3
      ? [Button.Yes, Button.Rainbow]
      : [Button.Yes, Button.No]

  await createRound({
    bussen,
    choices,
    correctGuessCondition: (choice, card) => {
      const testCards = cards.filter(c => c.id !== card.id)
      return (
        (choice === Button.Rainbow &&
          getUniqueCardSuits(bussen.currentPlayer.cards).length === 4) ||
        (choice === Button.Yes && testCards.some(c => c.suit === card.suit)) ||
        (choice === Button.No && testCards.every(c => c.suit !== card.suit))
      )
    },
    description: `${
      player.tag
    }, do you already have next card's suit?\nYou have: ${getUniqueCardSuits(
      player.cards,
    ).join(' ')}`,
    drinkAmount: 1,
    player,
    roundNr: 4,
  })
}
