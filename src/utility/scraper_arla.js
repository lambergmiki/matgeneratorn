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

    /**
     * Builds the API URL which is to be used for the actual call.
     *
     * @param {Array} tagsArray - an array of tags to be used in the construction of the API.
     * @returns {URL} url - the API.
     */
    const buildUrl = (tagsArray) => {
      const url = `${API_ENDPOINT}?&tags=${tagsArray.join('&tags=')}`
      console.log('built url:', url)
      return url
    }

    // Fire the two calls in parallel
    const [resWeekday, resWeekend] = await Promise.all([
      axios.get(buildUrl(weekdayTags)),
      axios.get(buildUrl(weekendTags))
    ])

    // Extract recipe objects from payloads
    const poolW = (resWeekday.data?.gridCards?.items || [])
      .filter(i => i.type === 'recipe')
    const poolE = (resWeekend.data?.gridCards?.items || [])
      .filter(i => i.type === 'recipe')

    // Shuffles both pools of recipes
    const weekShuffled = shuffle(poolW)
    const endShuffled = shuffle(poolE)

    // Pick initial recipes and tag them by occasion
    const weekdayRecipes = pickRandom(weekShuffled, 5)
      .map(r => ({ ...r, occasion: 'weekday' }))
    const weekendRecipes = pickRandom(endShuffled, 2)
      .map(r => ({ ...r, occasion: 'weekend' }))

    // Merge recipes
    let merged = weekdayRecipes.concat(weekendRecipes)
    console.log(merged.map(r => `${r.title} (${r.occasion})`))

    // Remove any duplicates
    merged = removeDuplicates(merged)

    // Count how many of each you have now
    const numWeekday = merged.filter(r => r.occasion === 'weekday').length
    const numWeekend = merged.filter(r => r.occasion === 'weekend').length

    // If short, pull one more from that pool, tag it, and push()
    if (numWeekday < 5) {
      const next = weekShuffled.pop() // pop so you won’t re-use later
      if (next) merged.push({ ...next, occasion: 'weekday' })
      console.log(
        'Replaced a duplicate with new weekday recipe:',
        next.title, next.url
      )
    }

    if (numWeekend < 2) {
      const next = endShuffled.pop()
      if (next) merged.push({ ...next, occasion: 'weekend' })
      console.log(
        'Replaced a duplicate with new weekend recipe:',
        next.title, next.url
      )
    }

    return merged
      .map(({ title, url }) => ({
        title,
        url: BASE_URL + url.trim()
      }))
  } catch (err) {
    console.error(err)
    return []
  }
}
