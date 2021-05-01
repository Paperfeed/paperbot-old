import { createCanvas, Image, loadImage } from 'canvas'
import path from 'path'
import { apply, length, map, pipe } from 'ramda'

import { Card } from './Card'

const GAP = 5
const CARD_RATIO = 1.52822
const CARD_WIDTH = 100
const CARD_HEIGHT = CARD_WIDTH * CARD_RATIO

const getLongestRowCount = pipe(map(length), apply(Math.max))

/**
 *  Creates an image of the provided cards
 * @param cards - First row, can be single card
 * @param rows - Optional extra rows in the form of Card[]
 */
export const createCardCanvas = async (
  cards: Card | Card[],
  ...rows: Card[][]
) => {
  const firstRow = Array.isArray(cards) ? cards : [cards]
  const allRows = [firstRow, ...rows].filter(Boolean)

  const amountOfRows = rows ? rows.length + 1 : 1
  const amountOfColumns = getLongestRowCount(allRows)
  const longestRowWidth = (CARD_WIDTH + GAP) * amountOfColumns

  const [canvasWidth, canvasHeight] =
    amountOfColumns > 1
      ? [longestRowWidth, (CARD_HEIGHT + GAP) * amountOfRows]
      : [CARD_WIDTH + GAP, CARD_HEIGHT + GAP]

  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')

  const rowPromises: Promise<Image[]>[] = []

  allRows.forEach(row => {
    const imagePromises: Promise<Image>[] = []
    row.forEach(card => {
      const imagePath = path.join(global.appRoot, card.assetPath)
      imagePromises.push(loadImage(imagePath))
    })
    rowPromises.push(Promise.all(imagePromises))
  })

  const rowImages = await Promise.all(rowPromises)

  rowImages.forEach((row, rowIndex) => {
    row.forEach((image, columnIndex) => {
      const rowWidth = row.length * (CARD_WIDTH + GAP)
      const xOffset = (longestRowWidth - rowWidth) / 2
      const yOffset = (CARD_HEIGHT + GAP) * rowIndex
      ctx.globalAlpha = allRows[rowIndex][columnIndex].renderOpacity
      ctx.drawImage(
        image,
        (CARD_WIDTH + GAP) * columnIndex + xOffset,
        GAP / 2 + yOffset,
        CARD_WIDTH,
        CARD_HEIGHT,
      )
    })
  })

  return canvas.toBuffer()

  // const filename = 'table.png'
  // const out = createWriteStream(global.appRoot + `/assets/${filename}`)
  // const stream = canvas.createPNGStream()
  // stream.pipe(out)
  // return new Promise<{ filename: string; path: string }>(resolve => {
  //   out.on('finish', () =>
  //     resolve({
  //       filename,
  //       path: path.join(global.appRoot, `/assets/${filename}`),
  //     }),
  //   )
  // })
}

export const renderDrawnCards = async (cards: Card[]) => {
  const canvasWidth = cards.length * (CARD_WIDTH + GAP)
  const canvasHeight = CARD_HEIGHT + GAP

  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')

  const imagePromises = cards.map(card => {
    const imagePath = path.join(global.appRoot, card.assetPath)
    return loadImage(imagePath)
  })

  const images = await Promise.all(imagePromises)
  images.forEach((image, columnIndex) => {
    ctx.drawImage(
      image,
      (CARD_WIDTH + GAP) * columnIndex,
      GAP / 2,
      CARD_WIDTH,
      CARD_HEIGHT,
    )
  })

  return canvas.toBuffer()
}
