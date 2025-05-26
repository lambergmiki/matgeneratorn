/**
 * @file Defines the main router.
 * @module router
 */

import express from 'express'
import { router as recipeRouter } from './recipeRouter.js'
import { preloadTotalCount } from '../middleware/preloadTotalCount.js'

export const router = express.Router()

/**
 * GET /
 * Render the home page.
 */
router.get('/', (req, res) => {
  // Catch any unhandled rejections from preloadTotalCount (outside the internal try/catch)
  preloadTotalCount().catch(console.error)
  res.render('home/index')
})

// mount recipeRouter on /recipes
router.use('/recipes', recipeRouter)
