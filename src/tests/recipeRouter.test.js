import request from 'supertest'
import * as cheerio from 'cheerio'
import app from '../server.js'

describe('POST /recipes route', () => {
  test('Should render exactly 7 cards in the .recipe-column', async () => {
    const response = await request(app)
      .post('/recipes')
      .send({ tag1: 'tdb:7007', tag2: 'tdb:6985' })
      .expect(200)

    // load HTML into cheerio, .text equals text representation of response body
    const $ = cheerio.load(response.text)
    const cards = $('.column.recipe-column .card')

    expect(cards.length).toBe(7)
  })
})

describe('GET request for / (root) route', () => {
  test('get /recipes route', async () => {
    const response = await request(app)
      .get('/recipes')
      .expect(200)

    const $ = cheerio.load(response.text)
    const title = $('title').text()

    expect(title).toBe('Maträttsgeneratorn')
  })
})
