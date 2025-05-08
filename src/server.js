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
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { router } from './router/router.js'

try {
  const app = express()

  const directoryFullName = dirname(fileURLToPath(import.meta.url)) // Get the directory of this file

  // Set the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'

  app.set('trust proxy', 1) // Trust the first proxy, Nginx, to pass the real client IP via X-Forwarded-For

  app.set('view engine', 'ejs')
  app.set('views', 'src/views')

  app.use(logger('dev'))
  app.use(helmet())
  app.use(express.json())

  // Pass base URL to views (middleware).
  app.use((res, next) => {
    res.locals.baseURL = baseURL
    next()
  })

  app.use(baseURL, router)

  // Serve static files such as CSS, images, and JavaScript.
  // The '/matgeneratorn' path will be used for serving static content (like CSS files) from the 'public' folder.
  app.use(baseURL, express.static(join(directoryFullName, '..', 'public')))

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
