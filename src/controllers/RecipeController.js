import { getRecipes } from '../utility/recipeService.js'

/**
 * @file Controller for recipe-related operations.
 * @module recipeController
 */

export const recipeController = {

  /**
   * Handles recipe generation and rendering.
   *
   * Makes an API call via `getRecipes()` with or without filter (parameter #3),
   * renders the result in a recipe list view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Array} recipes -
   */
  async renderRecipes (req, res) {
    const weekday = 'tdb:7007'
    const weekend = 'tdb:6985'
    const days = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag']

    try {
      // `req.body.tag` if present is applied as a tag (third parameter) to API call and filters result.
      const tag3 = req.body.tag
      const recipes = tag3
        ? await getRecipes(weekday, weekend, tag3)
        : await getRecipes(weekday, weekend)

      // Error-check for simulated API failure, TC1.3. TODO: error handler
      // if (recipes.length === 0) {
      //   throw new Error('No recipes generated.')
      // }

      console.log('Sending recipe titles:', recipes.map(r => r.title)) // debugger

      return res.render('recipes/list', { recipes, days })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'API seems to be disabled, contact application manager.' })
    }
  }
}
