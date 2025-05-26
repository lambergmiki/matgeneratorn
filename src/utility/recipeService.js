/**
 * @file Main function for API calls.
 * @module utilities
 */

import axios from 'axios'
import { shuffle } from '../utility/shuffle.js'
import { removeDuplicates } from './removeDuplicates.js'
import { pickRandom } from './pickRandom.js'
import { buildUrl } from './buildUrl.js'
import { getCategorySkipLookup } from './categorySkipvalues.js'

const BASE_URL = 'https://arla.se'
const API_ENABLED = true // Debug flag for testing error handling.

/*
  Creates arrays of skip values for weekday and weekend categories, respectively.
  Array.from({ length: N }, (_, i) => i * 20) results in [0, 20, 40, ...].
  N determines how many 20-recipe pages exist for each tag.
  Length values last updated 26th of May 2025.
*/
const BASE_TAGS = {
  'tdb:7007': Array.from({ length: 174 }, (_, i) => i * 20), // [0, 20, …, 3460]
  'tdb:6985': Array.from({ length: 39 }, (_, i) => i * 20) // [0, 20, …, 760]
}

/**
 * Fetches recipes based from Arlas database via their API.
 * Fetch can be customized with third parameter, a filter specifying what kind of recipes are
 * to be presented. SOmething something.
 *
 * @param {string} tag1 - Default category #1, weekday-tag.
 * @param {string} tag2 - Default category #2, weekend-tag.
 * @param {string} tag3 - Optional filter tag (e.g. 'vegetarian'). Only one tag is supported.
 * @returns {Promise<Array<{ title: string, url: string, picture: string }>>} Array of processed,
 * user-friendly data.
 */
export async function getRecipes (tag1, tag2, tag3) {
  try {
    if (!API_ENABLED) throw new Error('API disabled (simulated failure)')

    // Extend weekday/weekend tags with optional filter (if provided).
    const weekdayTags = [tag1].concat(tag3 || [])
    const weekendTags = [tag2].concat(tag3 || [])

    /**
     * Assign the skip values for each default category from BASE_TAGS. These are applied
     * to the API call if no filter (third parameter) is selected.
     * If a filter tag is selected, the respective skip values are applied for that particular tag.
     */
    let weekdaySkips = BASE_TAGS[tag1]
    let weekendSkips = BASE_TAGS[tag2]
    console.log('weekday skip values:', weekdaySkips)
    console.log('weekend skip values:', weekendSkips)

    // THIS BLOCK HAS TO BE MUCH SIMPLER... HELP
    if (tag3) {
      console.log('tag3 before reassigning to chosenFoodCategory:', tag3)
      const chosenFoodCategory = getCategorySkipLookup(tag3)
      console.log('chosenFoodCategory:', chosenFoodCategory)
      weekdaySkips = chosenFoodCategory.weekdaySkips
      weekendSkips = chosenFoodCategory.weekendSkips
    }

    // Shuffle skip values
    shuffle(weekdaySkips)
    shuffle(weekendSkips)

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

    // Shuffle recipe pools
    shuffle(poolW)
    shuffle(poolE)

    // Pick initial recipes and tag them by occasion
    const weekdayRecipes = pickRandom(poolW, 5)
      .map(r => ({ ...r, occasion: 'weekday' }))
    const weekendRecipes = pickRandom(poolE, 2)
      .map(r => ({ ...r, occasion: 'weekend' }))

    // Merge recipes
    let merged = weekdayRecipes.concat(weekendRecipes)
    console.log(merged.map(r => `${r.title} (${r.occasion})`))

    // Remove any duplicates
    merged = removeDuplicates(merged)

    // Count the amount of recipes per occasion (5 + 2 for a default week).
    const numWeekday = merged.filter(r => r.occasion === 'weekday').length
    const numWeekend = merged.filter(r => r.occasion === 'weekend').length

    // If short, refill by extracting one recipe from that pool, tag it and push it into the merged list.
    if (numWeekday < 5) {
      const next = poolW.pop()
      if (next) merged.push({ ...next, occasion: 'weekday' })
    }
    if (numWeekend < 2) {
      const next = poolE.pop()
      if (next) merged.push({ ...next, occasion: 'weekend' })
    }

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
