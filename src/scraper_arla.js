import axios from 'axios'

// const weekend = 'tdb%3A6985'
// const weekday = 'tdb%3A7007'
// const requestNo = shouldBeUserInput

const BASE_URL = 'https://arla.se'
const API_ENDPOINT = `${BASE_URL}/cvi/facet/api/sv/recipes`

/**
 * First implementation of the scraper function,
 * this one handles scraping of arla.se.
 *
 * @param {number} requestNo - the number of recipes user requests.
 * @returns {Array} searchResult - the recipes after filter has been applied.
 */
export async function getRecipes (requestNo = 7) {
  try {
    const { data } = await axios.get(API_ENDPOINT, {
      params: {
        tags: 'tdb:7007' // weekday
      }
    })

    /**
     * Defensive assignment of `items` - first, by optional chaining, check that `data`,
     * `gridCards` and `items` all exist in the expected structure. If they do, and `items`
     * is an array, return it. If not, due to API changes or malfunction, return an empty array as fallback.
     */
    const items = Array.isArray(data?.gridCards?.items) ? data.gridCards.items : []

    const recipes = items
      .filter(item => item.type === 'recipe')
      .slice(0, requestNo)
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
