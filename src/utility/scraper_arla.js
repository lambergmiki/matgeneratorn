import axios from 'axios'
import { shuffle } from '../utility/shuffle.js'
import { removeDuplicates } from './removeDuplicates.js'
import { pickRandom } from './pickRandom.js'

// CONFIG, SUBJECT TO CHANGE WITH ADDITIONAL FEATURES

const BASE_URL = 'https://arla.se'
const API_ENDPOINT = `${BASE_URL}/cvi/facet/api/sv/recipes`
const API_ENABLED = true // debugger flag, used for testing error handling on bad API calls

/**
 * First version of experimental, multi-category getRecipes().
 *
 * @param {string} tag1 - default category #1, weekday-tag.
 * @param {string} tag2 - default category #2, weekend-tag.
 * @param {string} tag3 - optional extra filter-tag (string or array of strings, i.e. "chicken", "vegetarian" etc.)
 * @returns {Array} searchResult - the recipes after filter has been applied.
 */
export async function getRecipes (tag1, tag2, tag3) {
  try {
    if (!API_ENABLED) throw new Error('API disabled (simulated failure)')

    // if there are categories of food selected (tag3), add it or them to the weekday/weekend tags array.
    const weekdayTags = [tag1].concat(tag3 || [])
    const weekendTags = [tag2].concat(tag3 || [])

    // Fire the two calls in parallel
    const [resW, resE] = await Promise.all([
      axios.get(API_ENDPOINT, { params: { tags: weekdayTags } }),
      axios.get(API_ENDPOINT, { params: { tags: weekendTags } })
    ])

    // Extract & shuffle the pools
    const poolW = (resW.data?.gridCards?.items || [])
      .filter(i => i.type === 'recipe')
    const poolE = (resE.data?.gridCards?.items || [])
      .filter(i => i.type === 'recipe')

    const weekShuffled = shuffle(poolW)
    const endShuffled = shuffle(poolE)

    // Pick 5 + 2
    const weekdayRecipes = weekShuffled.slice(0, 5)
    const weekendRecipes = endShuffled.slice(0, 2)

    return [
      ...weekdayRecipes,
      ...weekendRecipes
    ].map(({ title, url }) => ({
      title,
      url: BASE_URL + url.trim()
    }))
  } catch (err) {
    console.error(err)
    return []
  }
}
