import express from 'express'
import { limiter } from '../middleware/limiter.js'
import { recipeController } from '../controllers/RecipeController.js'

export const router = express.Router()

router.get('/', (req, res) => { res.render('recipes/index') })

// the main route to generated recipes, recipes/list, subject to change
router.post('/', limiter, (req, res) => recipeController.renderRecipes(req, res))
