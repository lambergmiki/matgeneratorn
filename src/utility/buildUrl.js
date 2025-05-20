const API_ENDPOINT = 'https://arla.se/cvi/facet/api/sv/recipes'

/**
 * Builds the API URL which is to be used for the actual call.
 *
 * @param {Array} tagsArray - an array of tags to be used in the construction of the API.
 * @param {number} [skip=0] - skip value to be randomized. Defaults to 0 (first 20 results)
 * if not applied as argument.
 * @returns {URL} - the API endpoint, complete with user input.
 */
export function buildUrl (tagsArray, skip = 0) {
  const tagsPartOfUrl = tagsArray.map(tag => `tags=${tag}`).join('&')
  const url = `${API_ENDPOINT}?skip=${skip}&${tagsPartOfUrl}`
  console.log('built url:', url)
  return url
}
