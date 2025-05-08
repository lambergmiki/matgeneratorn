import express from 'express'
// import { router as homeRouter } from './homeRouter.js'
import { router as recipeRouter } from './recipeRouter.js'

export const router = express.Router()

// Define your routes here
router.get('/', (req, res) => { res.render('home/index') })

// mount recipeRouter on /recipes
router.use('/recipes', recipeRouter)
