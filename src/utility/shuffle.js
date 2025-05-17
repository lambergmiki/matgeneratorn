/**
 * Fisher–Yates shuffle → in-place randomization of an array.
 *
 * @param {Array} array - The array to be shuffled
 * @returns {Array} The shuffled array (same array reference, modified in-place)
 */
export function shuffle (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
