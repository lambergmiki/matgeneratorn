/**
 * @file Defines the main application.
 * Lightweight server.js.
 * @module src/server
 * @author Miki Lamberg
 * @version 0.1
 */

import '@lnu/json-js-cycle'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { router } from './router/router.js'

try {
  const app = express()

  app.set('trust proxy', 1) // Trust the first proxy, Nginx, to pass the real client IP via X-Forwarded-For

  app.set('view engine', 'ejs')
  app.set('views', 'src/views')

  app.use(logger('dev'))
  app.use(helmet())
  app.use(express.json())

  app.use('/matgeneratorn', router)

  // Serve static files (e.g., CSS, images, JS) under the /matgeneratorn path
  app.use('/matgeneratorn', express.static('public'))

  // include fallback PORT if .env is not included at runtime for Docker container.
  // .env is currently not in use
  const server = app.listen(process.env.PORT || 5005, () => {
    console.info(`Server running at http://localhost:${server.address().port}`)
    console.log('testing only for docker compose purposes')
  })
} catch (err) {
  console.error(err.message, { error: err })
  process.exitCode = 1
}
