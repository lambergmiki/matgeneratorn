/**
 * Picks random items from an array.
 *
 * @param {Array} arr - The source array to pick items from
 * @param {number} count - The number of items to pick
 * @returns {Array} An array containing the randomly picked items
 */
export function pickRandom (arr, count) {
  const result = []

  while (result.length < count && arr.length > 0) {
    result.push(arr.pop())
  }

  return result
}
