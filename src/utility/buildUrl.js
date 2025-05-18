const API_ENDPOINT = 'https://arla.se/cvi/facet/api/sv/recipes'

/**
 * Builds the API URL which is to be used for the actual call.
 *
 * @param {Array} tagsArray - an array of tags to be used in the construction of the API.
 * @returns {URL} url - the API.
 */
export function buildUrl (tagsArray) {
  const url = `${API_ENDPOINT}?&tags=${tagsArray.join('&tags=')}`
  console.log('built url:', url)
  return url
}
