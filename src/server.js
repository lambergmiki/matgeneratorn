/**
 * @file Defines the main application.
 * Lightweight server.js.
 * @module src/server
 * @author Miki Lamberg
 * @version 0.1
 */

import '@lnu/json-js-cycle'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { router } from './router/router.js'

try {
  const app = express()

  app.set('view engine', 'ejs')
  app.set('views', 'src/views')

  app.use(helmet())
  app.use(cors())
  app.use(express.json())

  app.use('/', router)

  // Built in middleware of Express, 'static' serves static files from 'public' (root) specified here.
  app.use(express.static('public'))

  const server = app.listen(process.env.PORT, () => {
    console.info(`Server running at http://localhost:${server.address().port}`)
    console.info('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err.message, { error: err })
  process.exitCode = 1
}
