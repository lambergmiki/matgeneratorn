import express from 'express'
import { recipeController } from '../controllers/RecipeController.js'

export const router = express.Router()

// placeholder route, not necessarily needed - http://localhost:5005/recipes
router.get('/', (req, res) => { res.render('recipes/index') })

// the main route to generated recipes, recipes/list, subject to change
router.post('/', (req, res) => recipeController.scrapeArla(req, res))
