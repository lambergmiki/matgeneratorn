import express from 'express'
import { recipeController } from '../controllers/RecipeController.js'

export const router = express.Router()

router.get('/', (req, res) => {
  res.render('recipes/index')
})

router.post('/', (req, res) => recipeController.scrapeArla(req, res))
