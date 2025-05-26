/**
 * @file Helper function for recipeService.js.
 * @module utilities
 */

/**
 * Picks a number of items from the end of an array.
 * Assumes the array has been shuffled beforehand, as it has in `getRecipes()` with the aid of
 * `shuffle()` - another utility function.
 * This function does not perform random selection itself.
 *
 * @param {Array} arr - The source array to pick items from.
 * @param {number} count - The number of items to pick.
 * @returns {Array} An array containing the picked items.
 */
export function pickRandom (arr, count) {
  const result = []

  while (result.length < count && arr.length > 0) {
    result.push(arr.pop())
  }

  return result
}
