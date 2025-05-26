/**
 * @file Helper function for recipeService.js.
 * @module utilities
 */

// In-memory storage for each category's skip values. Updated externally in preloadTotalCount.js.
let categorySkipLookup = {}

/**
 * If called, updates the current skip values for each category after
 * a fetch has been made via the API.
 *
 * @param {object} data - Categories mapped to their skip values.
 */
export function setCategorySkipLookup (data) {
  categorySkipLookup = data
}

/**
 * Returns the current skip values for each category.
 *
 * @param {string} foodCategory - The category to look up (i.e. 'tdb:6547'), use in `getRecipes()`.
 * @returns {object} - Object containing arrays of skip values (weekdaySkips, weekendSkips).
 */
export function getCategorySkipLookup (foodCategory) {
  return categorySkipLookup[foodCategory]
}
