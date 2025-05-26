/**
 * @file Defines the recipe router.
 * @module recipeRouter
 */

import express from 'express'
import { limiter } from '../middleware/limiter.js'
import { recipeController } from '../controllers/RecipeController.js'

export const router = express.Router()

/**
 * GET /recipes
 * Render the recipe list page.
 */
router.get('/', (req, res) => { res.render('recipes/index') })

/**
 * POST /recipes
 * Generate recipes and render the results.
 * Rate-limit applied as middleware.
 */
router.post('/', limiter, (req, res) => recipeController.renderRecipes(req, res))
