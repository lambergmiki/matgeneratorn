import { getRecipes } from '../utility/scraper_arla.js'

export const recipeController = {

  /**
   * Invokes the scraper function and renders the result client side.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Array} recipes -
   */
  async scrapeArla (req, res) {
    const weekday = 'tdb:7007'
    const weekend = 'tdb:6985'

    try {
      console.log('req.body.tag(s) in scrapeArla():', req.body.tag) // ← must be an array or undefined
      const tag3 = req.body.tag
      const recipes = tag3
        ? await getRecipes(weekday, weekend, tag3)
        : await getRecipes(weekday, weekend)

      // TODO: Currently commented out while testing categories in development
      // Error-check for simulated API failure, TC1.3.
      // if (recipes.length === 0) {
      //   throw new Error('No recipes generated.')
      // }

      console.log('Sending recipe titles:', recipes.map(r => r.title)) // debugger

      return res.render('recipes/list', { recipes })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'API seems to be disabled, contact application manager.' })
    }
  }
}
