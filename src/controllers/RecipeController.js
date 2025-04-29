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
    try {
      const recipes = await getRecipes('tdb:6985', 'tdb:7007')
      console.log('Sending recipe titles:', recipes.map(r => r.title))

      return res.render('recipes/list', { recipes })
    } catch (err) {
      console.error(err)
      return res.status(500).render('error', { message: 'Scrape failed in backend, function scrapeArla' })
    }
  }
}
