import { createCanvas, loadImage } from 'canvas'
import path from 'path'

import { Currency } from '../Base/cardGameUtils'
import { Card } from '../Functional/Card'
import { PokerState } from './Poker'

const SCALE = 1.3
const CARD_RATIO = 1.52822
const CARD_WIDTH = 200
const CARD_HEIGHT = CARD_WIDTH * CARD_RATIO
const TABLE_WIDTH = 1000 * SCALE

const assets = new Map()

const getAssets = async () => {
  if (assets.size <= 0) {
    assets.set(
      'pokerTable',
      await loadImage(path.join(global.appRoot, 'assets/svgs/poker_table.svg')),
    )
    assets.set(
      'playerTag',
      await loadImage(path.join(global.appRoot, 'assets/svgs/player_tag.svg')),
    )
    assets.set(
      'redChip',
      await loadImage(path.join(global.appRoot, 'assets/svgs/red_chip.svg')),
    )
    assets.set(
      'blueChip',
      await loadImage(path.join(global.appRoot, 'assets/svgs/blue_chip.svg')),
    )
    assets.set(
      'blackChip',
      await loadImage(path.join(global.appRoot, 'assets/svgs/black_chip.svg')),
    )
    assets.set(
      'greenChip',
      await loadImage(path.join(global.appRoot, 'assets/svgs/green_chip.svg')),
    )
    assets.set(
      'whiteChip',
      await loadImage(path.join(global.appRoot, 'assets/svgs/white_chip.svg')),
    )
  }

  return {
    blackChip: assets.get('blackChip'),
    blueChip: assets.get('blueChip'),
    greenChip: assets.get('greenChip'),
    playerTag: assets.get('playerTag'),
    pokerTable: assets.get('pokerTable'),
    redChip: assets.get('redChip'),
    whiteChip: assets.get('whiteChip'),
  }
}

/**
 * Many magic numbers in here because I suck at math :|
 * @param state - <PokerState>
 * @param forPlayerId - Renders information related to this player
 */
export const renderPokerTable = async (
  state: PokerState,
  forPlayerId?: string,
) => {
  const {
    blackChip,
    blueChip,
    greenChip,
    playerTag,
    pokerTable,
    redChip,
    whiteChip,
  } = await getAssets()

  const playerAmount = state.playerAmount
  const xOffset = 340 * SCALE
  const yOffset = 100 * SCALE
  const gap = 12 * SCALE
  const rowOffset = 330 * SCALE
  const playerTagWidth = 150 * SCALE
  const playerTagHeight = playerTagWidth * 0.36667
  const columnOffset = playerTagWidth + 40 * SCALE
  const playersHalved = Math.ceil(playerAmount / 2)
  const ratio = pokerTable.naturalHeight / pokerTable.naturalWidth
  const tableEnlarger = Math.max(Math.floor((playerAmount - 5) / 2), 0)
  const dealerIndex = state.dealerIndex

  const tableWidth = TABLE_WIDTH + tableEnlarger * columnOffset
  const tableHeight = TABLE_WIDTH * ratio
  const canvas = createCanvas(tableWidth, tableHeight)
  const ctx = canvas.getContext('2d')
  ctx.antialias = 'subpixel'
  ctx.patternQuality = 'best'
  ctx.filter = 'best'
  ctx.imageSmoothingQuality = 'high'
  ctx.imageSmoothingEnabled = true
  ctx.drawImage(pokerTable, 0, 0, tableWidth, tableHeight)

  for (let index = 0; index < playerAmount; index++) {
    const player = state.players[index]
    const row = index < playerAmount / 2 ? 0 : 1
    const playerOffset = Math.max((index - 1) % playersHalved, 0)
    const isOnTableHead = index === 0 || index === playersHalved

    let x: number, y: number
    if (index === 0) {
      x = xOffset - 260 * SCALE
      y = tableHeight / 2 - 10 * SCALE
    } else if (index === playersHalved) {
      x = tableWidth - 205 * SCALE
      y = tableHeight / 2 - 10 * SCALE
    } else {
      x = row
        ? xOffset + (playersHalved - 2 - playerOffset) * columnOffset
        : xOffset + playerOffset * columnOffset
      y = yOffset + row * rowOffset
    }

    // Player tag
    ctx.drawImage(
      playerTag,
      x - gap,
      y - gap * 2,
      playerTagWidth,
      playerTagHeight,
    )

    // Player info
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'left'
    ctx.font = `bold ${18 * SCALE}px Roboto`
    ctx.fillText(player.name, x, y - 3 * SCALE, 130 * SCALE)
    ctx.fillText(`${Currency.format(player.cash)} `, x, y + 24 * SCALE)

    const buttonXOffset = x + playerTagWidth - 35 * SCALE
    const buttonYOffset = row || isOnTableHead ? y - 55 * SCALE : y + 35 * SCALE
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${15 * SCALE}px Roboto`
    ctx.textAlign = 'center'

    // Dealer Button
    if (state.dealer?.id === player.id) {
      ctx.drawImage(
        redChip,
        buttonXOffset,
        buttonYOffset,
        25 * SCALE,
        25 * SCALE,
      )
      ctx.fillText('D', buttonXOffset + 13 * SCALE, buttonYOffset + 18 * SCALE)
    }

    // Blinds
    const blindX = buttonXOffset
    if (state.round === 1 && index === dealerIndex + 1) {
      ctx.font = `bold ${13 * SCALE}px Roboto`
      ctx.drawImage(greenChip, blindX, buttonYOffset, 20 * SCALE, 20 * SCALE)
      ctx.fillText('b', blindX + 10 * SCALE, buttonYOffset + 15 * SCALE)
    }
    if (state.round === 1 && index === dealerIndex + 2) {
      ctx.font = `bold ${15 * SCALE}px Roboto`
      ctx.drawImage(greenChip, blindX, buttonYOffset, 25 * SCALE, 25 * SCALE)
      ctx.fillText('B', blindX + 13 * SCALE, buttonYOffset + 18 * SCALE)
    }

    // Player cards
    const cardImages = await Promise.all(
      player.cards.map(c =>
        loadImage(
          path.join(
            global.appRoot,
            c.smallAssetPath(player.id !== forPlayerId),
          ),
        ),
      ),
    )
    cardImages.forEach((card, index) => {
      const cardWidth = 40.5 * SCALE
      const cardHeight = cardWidth * CARD_RATIO
      const cardGap = 3 * SCALE
      ctx.drawImage(
        card,
        x - 10 * SCALE + (index * cardWidth + index * cardGap),
        row || isOnTableHead
          ? y - playerTagHeight - gap - 25 * SCALE
          : y + 40 * SCALE,
        cardWidth,
        cardHeight,
      )
    })

    // Player chips
    const chips = [
      {
        asset: blackChip,
        value: 100,
      },
      {
        asset: blueChip,
        value: 50,
      },
      {
        asset: greenChip,
        value: 25,
      },
      {
        asset: redChip,
        value: 5,
      },
      {
        asset: whiteChip,
        value: 1,
      },
    ]

    let cash = player.cash
    let chipIndex = 0
    chips.forEach(({ asset, value }) => {
      if (cash <= 0) return
      const amount = Math.floor(cash / value)
      if (!amount) return

      cash -= amount * value
      const chipSize = 25 * SCALE
      const chipGap = 5 * SCALE
      const chipX = x - 13 * SCALE + chipIndex * (chipSize + chipGap)
      chipIndex++
      const chipY = row || isOnTableHead ? y + 35 * SCALE : y - 52 * SCALE
      ctx.drawImage(asset, chipX, chipY, chipSize, chipSize)
      ctx.font = `bold ${15 * SCALE}px Roboto`
      ctx.textAlign = 'center'
      if (value === 1) {
        ctx.fillStyle = '#000000'
      } else {
        ctx.fillStyle = '#FFFFFF'
      }
      ctx.fillText(amount.toString(), chipX + 12 * SCALE, chipY + 18 * SCALE)
    })
  }

  const cardImages = await Promise.all(
    state.cardsOnTable.map(c =>
      loadImage(path.join(global.appRoot, c.smallAssetPath())),
    ),
  )

  const tableCardsAmount = state.cardsOnTable.length
  const cardWidth = 55 * SCALE
  const cardHeight = cardWidth * CARD_RATIO
  const cardGap = 5 * SCALE

  // Draw table cards
  cardImages.forEach((card, index) => {
    ctx.drawImage(
      card,
      tableWidth / 2 -
        (cardWidth + cardGap) * (tableCardsAmount / 2 - index) +
        index * cardGap,
      tableHeight / 2 - cardHeight / 2,
      cardWidth,
      cardHeight,
    )
  })

  return canvas.toBuffer()
}

interface RenderPokerCardOptions {
  hideCards?: boolean
  label?: string
}
/**
 * @param cards - An array of cards
 * @param hideCards - When set forces the cards to be shown (false) or hidden (true)
 * @param label - Pass a label to render above the cards
 */
export const renderPokerCards = async (
  cards: Card[],
  { hideCards, label }: RenderPokerCardOptions = {},
) => {
  const gap = 5
  const yOffset = label ? 20 : 0
  const cardWidth = CARD_WIDTH + gap * 2
  const cardHeight = CARD_HEIGHT + yOffset + gap * 2
  const canvasWidth = cards.length * cardWidth

  const canvas = createCanvas(canvasWidth, cardHeight)
  const ctx = canvas.getContext('2d')

  const cardImages = await Promise.all(
    cards.map(c =>
      loadImage(path.join(global.appRoot, c.assetPath(hideCards))),
    ),
  )

  cardImages.forEach((card, index) => {
    ctx.drawImage(
      card,
      index * cardWidth + gap,
      gap + yOffset,
      CARD_WIDTH,
      CARD_HEIGHT,
    )
  })

  if (label) {
    ctx.font = 'bold 15px Roboto'
    ctx.fillStyle = '#FFF'
    ctx.fillText(label, gap, gap + 14)
  }

  return canvas.toBuffer()
}
