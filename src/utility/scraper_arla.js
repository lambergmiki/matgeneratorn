import axios from 'axios'

// CONFIG, SUBJECT TO CHANGE WITH ADDITIONAL FEATURES

const BASE_URL = 'https://arla.se'
const API_ENDPOINT = `${BASE_URL}/cvi/facet/api/sv/recipes`
const API_ENABLED = true // debugger flag, used for testing error handling on bad API calls

const step = 20 // the value of which skip parameter is incremented
// or use "totalCount" instead which is their own recipesTotal TODO
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
 * @param {string} tag1 - default category #1, weekday-tag.
 * @param {string} tag2 - default category #2, weekend-tag.
 * @param {string} tag3 - the category of food of which to apply to the search, i.e. vegetarian.
 * @returns {Array} searchResult - the recipes after filter has been applied.
 */
export async function getRecipes (tag1, tag2, tag3) {
  try {
    if (!API_ENABLED) throw new Error('API disabled (simulated failure)')

    // If skip value is null or the amount of recipes generated exceed 20,
    // get a new skip value and reset counter.
    if (currentSkip === null || recipesGenerated + 7 > step) {
      currentSkip = getRandomSkip()
      recipesGenerated = 0
      console.log('New skip value selected:', currentSkip)
    }

    // 7 recipes are to be generated from this API call
    recipesGenerated += 7

    // if there is a category of food selected, add it as a tag to the API call with tag1/tag2.
    const weekdayTags = tag3 ? [tag1, tag3] : [tag1]
    const weekendTags = tag3 ? [tag2, tag3] : [tag2]

    /**
     *
     * @param tagsArray
     */
    const buildUrl = (tagsArray) => {
      const url = `${API_ENDPOINT}?skip=${currentSkip}&tags=${tagsArray.join('&tags=')}`
      console.log('built url:', url)
      return url
    }

    console.log(weekendTags, weekdayTags)

    const [resWeekday, resWeekend] = await Promise.all([
      axios.get(buildUrl(weekdayTags)),
      axios.get(buildUrl(weekendTags))
    ])

    /**
     * Defensive assignment of `items` - first, by optional chaining, check that `data`,
     * `gridCards` and `items` all exist in the expected structure. If they do, and `items`
     * is an array, return it, filtered and sliced to fit the frontend.
     * If not, due to API changes or malfunction, return an empty array as fallback.
     */
    const weekdayRecipes = Array.isArray(resWeekday.data?.gridCards?.items)
      ? resWeekday.data.gridCards.items.filter(item => item.type === 'recipe').slice(0, 5)
      : []
    const weekendRecipes = Array.isArray(resWeekend.data?.gridCards?.items)
      ? resWeekend.data.gridCards.items.filter(item => item.type === 'recipe').slice(0, 2)
      : []

    const recipes = [...weekdayRecipes, ...weekendRecipes].map(({ title, url }) => ({
      title,
      url: BASE_URL + url.trim()
    }))

    return recipes
  } catch (err) {
    console.error(err)
    return []
  }
}
