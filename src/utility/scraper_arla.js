import axios from 'axios'
import { shuffle } from '../utility/shuffle.js'
import { removeDuplicates } from './removeDuplicates.js'
import { pickRandom } from './pickRandom.js'
import { buildUrl } from './buildUrl.js'
import { getCategorySkipLookup } from './categorySkipvalues.js'

// CONFIG, SUBJECT TO CHANGE WITH ADDITIONAL FEATURES

const BASE_URL = 'https://arla.se'
const API_ENABLED = true // debugger flag, used for testing error handling on bad API calls

// Hard-coded skip values per tag due to time constraint
const BASE_TAGS = {
  'tdb:7007': Array.from({ length: 174 }, (_, i) => i * 20), // [0, 20, …, 3460]
  'tdb:6985': Array.from({ length: 39 }, (_, i) => i * 20) // [0, 20, …, 760]
}

/**
 * First version of experimental, multi-category getRecipes().
 *
 * @param {string} tag1 - default category #1, weekday-tag.
 * @param {string} tag2 - default category #2, weekend-tag.
 * @param {string} tag3 - optional filter tag, i.e. "vegetarian" or
 * @returns {Array} searchResult - the recipes after filter has been applied.
 */
export async function getRecipes (tag1, tag2, tag3) {
  try {
    if (!API_ENABLED) throw new Error('API disabled (simulated failure)')

    // if there are categories of food selected (tag3), add it or them to the weekday/weekend tags array.
    const weekdayTags = [tag1].concat(tag3 || [])
    const weekendTags = [tag2].concat(tag3 || [])

    // Decide where to pull skip-values from
    // if tag3 is undefined or not in your BASE_TAGS lookup, fall back to defaults
    let weekdaySkips = BASE_TAGS[tag1]
    let weekendSkips = BASE_TAGS[tag2]

    if (tag3) {
      // overwrite previous arrays with skip values of tag3
      const dynamic = getCategorySkipLookup(tag3)
      weekdaySkips = dynamic.weekdaySkips
      weekendSkips = dynamic.weekendSkips
      console.log('🔍 dynamic:', dynamic) // debugger
    }

    // Randomly pick one skip from each array of values and destructure the one-item array.
    const [weekdayRandomSkip] = pickRandom(weekdaySkips, 1)
    const [weekendRandomSkip] = pickRandom(weekendSkips, 1)
    console.log('🎲 weekdayRandomSkip:', weekdayRandomSkip) // debugger
    console.log('🎲 weekendRandomSkip:', weekendRandomSkip) // debugger

    // Fire the two calls in parallel
    const [resWeekday, resWeekend] = await Promise.all([
      axios.get(buildUrl(weekdayTags, weekdayRandomSkip)),
      axios.get(buildUrl(weekendTags, weekendRandomSkip))
    ])

    // Extract recipe objects from payloads and filter into a managable array of recipe objects
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
    console.log('weekdayRecipes, randomiserade, och borde stå som occasion: weekend', weekdayRecipes)

    // Merge recipes.
    let merged = weekdayRecipes.concat(weekendRecipes)
    console.log(merged.map(r => `${r.title} (${r.occasion})`))

    // Remove any duplicates.
    merged = removeDuplicates(merged)

    // Count the amount of recipes per occasion (5 + 2 for a default week).
    const numWeekday = merged.filter(r => r.occasion === 'weekday').length
    const numWeekend = merged.filter(r => r.occasion === 'weekend').length

    // If short, refill by extracting one recipe from that pool, tag it and push it into the merged list.
    if (numWeekday < 5) {
      const next = weekShuffled.pop()
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
    console.log('this is the merged list', merged)
    console.log('this is object one and its attributes... specially picture url?', merged[0].picture.url)
    return merged
      .map(({ title, url, picture }) => ({
        title,
        url: BASE_URL + url.trim(),
        picture: picture.url
      }))
  } catch (err) {
    console.error(err)
    return []
  }
}
