/**
 * Remove duplicates from an array of recipes by title.
 *
 * @param {Array} recipes - the list of recipes to be checked for duplicates.
 * @returns {Array} the final recipe list with no potential duplicates.
 */
export function removeDuplicates (recipes) {
  const seen = new Set()
  return recipes.filter(recipe => {
    // if title has been seen, skip it in the filter()-process.
    if (seen.has(recipe.title)) {
      return false
    }

    // Otherwise add it to the `seen` and return true so filter() keeps it.
    seen.add(recipe.title)
    return true
  })
}
