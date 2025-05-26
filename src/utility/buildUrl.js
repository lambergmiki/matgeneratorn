/**
 * @file Helper function for recipeService.js.
 * @module utilities
 */

const API_ENDPOINT = 'https://arla.se/cvi/facet/api/sv/recipes'

/**
 * Builds the API URL used for fetching recipes.
 *
 * @param {Array<string>} tagsArray - An array of tags to be used in the construction of the API.
 * @param {number} [skip=0] - Skip value to be randomized. Defaults to 0 if not applied as argument.
 * @returns {URL} - Complete API URL with query parameters.
 */
export function buildUrl (tagsArray, skip = 0) {
  const tagsPartOfUrl = tagsArray.map(tag => `tags=${tag}`).join('&')
  const url = `${API_ENDPOINT}?skip=${skip}&${tagsPartOfUrl}`
  console.log('built url:', url)
  return url
}
