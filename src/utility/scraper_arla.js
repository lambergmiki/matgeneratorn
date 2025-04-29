import axios from 'axios'

// CONFIG, SUBJECT TO CHANGE WITH ADDITIONAL FEATURES

const BASE_URL = 'https://arla.se'
const API_ENDPOINT = `${BASE_URL}/cvi/facet/api/sv/recipes`

const step = 20 // the value of which skip parameter is incremented
const recipesTotal = 768 // max amount of pages for weekday category
const maxSkip = Math.floor(recipesTotal / step) * step // 760

// Utility

let recipesGenerated = 0
let currentSkip = null

/**
 * Generate a random index value from 0 to 38 (idx),
 * then multiply by 20 (step) to get skip value between 20 and 760,
 * matching the total amount of recipes, 768.
 *
 * @returns {number} The skip value to be inserted into the API_ENDPOINT.
 */
function getRandomSkip () {
  const maxIndex = maxSkip / step // 38
  const idx = Math.floor(Math.random() * (maxIndex + 1))
  return idx * step // 0,20,40…760
}

/**
 * First implementation of the scraper function,
 * this one handles scraping of arla.se.
 *
 * @param {number} skip - the step value of where in the array of recipes scraping happens.
 * @param {string} tags - the category of which to scrape from, i.e. "weekday-recipes = 6985".
 * @param tag1
 * @param tag2
 * @returns {Array} searchResult - the recipes after filter has been applied.
 */
export async function getRecipes (tag1, tag2) {
  try {
    // If skip value is null or the amount of recipes generated exceed 20,
    // get a new skip value and reset counter.
    if (currentSkip === null || recipesGenerated + 7 > step) {
      currentSkip = getRandomSkip()
      recipesGenerated = 0
      console.log('New skip value selected:', currentSkip)
    }

    // 7 recipes are to be generated from this API call
    recipesGenerated += 7

    const [res1, res2] = await Promise.all([
      axios.get(API_ENDPOINT, { params: { skip: currentSkip, tags: tag1 } }),
      axios.get(API_ENDPOINT, { params: { skip: currentSkip, tags: tag2 } })
    ])

    /**
     * Defensive assignment of `items` - first, by optional chaining, check that `data`,
     * `gridCards` and `items` all exist in the expected structure. If they do, and `items`
     * is an array, return it. If not, due to API changes or malfunction, return an empty array as fallback.
     */
    const weekdayRecipes = Array.isArray(res1.data?.gridCards?.items) ? res1.data.gridCards.items : []
    const weekendRecipes = Array.isArray(res2.data?.gridCards?.items) ? res2.data.gridCards.items : []

    const combinedRecipes = [...weekdayRecipes, ...weekendRecipes]
    const recipes = combinedRecipes
      .filter(item => item.type === 'recipe')
      .slice(0, 7)
      .map(({ title, url }) => ({
        title,
        url: BASE_URL + url.trim()
      }))

    return recipes
  } catch (err) {
    console.error('getRecipes error:', err)
    return []
  }
}
