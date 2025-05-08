import express from 'express'
// import { router as homeRouter } from './homeRouter.js'
import { router as recipeRouter } from './recipeRouter.js'
import { baseURL } from '../server.js'

export const router = express.Router()

// Define your routes here
router.get(baseURL, (req, res) => { res.render('home/index') })

// mount recipeRouter on /recipes
router.use('/recipes', recipeRouter)
