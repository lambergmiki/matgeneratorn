import express from 'express'

export const router = express.Router()

// Define your routes here
router.get('/', (req, res) => { res.render('home/index') })
