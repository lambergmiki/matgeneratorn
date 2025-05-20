// In-memory store for recipe category skip data
let categorySkipLookup = {} // Private variable, updated via the setter

/**
 * Updates the current skip lookup data.
 * Call this after fetching fresh skip values from the API.
 *
 * @param {object} data - The new skip data
 */
export function setCategorySkipLookup (data) {
  categorySkipLookup = data
}

/**
 * Returns the current skip lookup data.
 * Can be imported anywhere that needs to access the current skips.
 *
 * @param {string} foodCategory - entered in getRecipes() as 'tag3', choice from user.
 * @returns {object} an object with arrays of skip values for weekday/weekend per category.
 */
export function getCategorySkipLookup (foodCategory) {
  return categorySkipLookup[foodCategory]
}
