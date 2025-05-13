/**
 * pick `count` random items from `arr`, or all if shorter
 *
 * @param arr
 * @param count
 */
export function pickRandom (arr, count) {
  const copy = shuffle(arr.slice())
  return copy.slice(0, Math.min(count, copy.length))
}
