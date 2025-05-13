/**
 * Remove duplicates from an array of recipes by URL
 *
 * @param recipes
 */
export function removeDuplicates (recipes) {
  const seen = new Set()
  return recipes.filter(r => {
    if (seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })
}
