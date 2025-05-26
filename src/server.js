/**
 * @file Defines the main application.
 * Lightweight server.js.
 * @module src/server
 * @version 0.9
 */

import '@lnu/json-js-cycle'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { router } from './router/router.js'

// Defines the app variable at the top level so it can be exported for testing (e.g., with Supertest).
let app

try {
  console.log('BASE_URL from .env: ', process.env.BASE_URL) // Debugging the environment variable

  app = express()

  const directoryFullName = dirname(fileURLToPath(import.meta.url)) // Get the directory of this file
  console.log('directoryFullName: ', directoryFullName)

  // Set the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'
  console.log('baseURL: ', baseURL)

  app.set('trust proxy', 1) // Trust the first proxy, Nginx, to pass the real client IP via X-Forwarded-For

  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
  app.set('layout extractScripts', true)
  app.set('layout extractStyles', true)
  app.use(expressLayouts)

  /**
   * Middleware to parse URL-encoded bodies (from HTML form submissions, e.g., recipes/index.ejs).
   *
   * Using `extended: true` enables parsing of URL-encoded data correctly.
   *
   * Users can only select a single checkbox for tags in this version,
   * so the parsed field (`req.body.tag`) will always be a string, i.e. 'tdb:6547'.
   */
  app.use(express.urlencoded({ extended: true }))

  app.use(logger('dev'))
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // only load resources from my own origin
          scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'], // allow scripts from animejs lib via CDN
          imgSrc: ["'self'", 'data:', 'https://images.arla.com'] // allow images from arla
        }
      }
    })
  )
  app.use(express.json())

  // Pass base URL to views (middleware).
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL
    next()
  })

  // Serve static files such as CSS, images, and JavaScript.
  // The '/matgeneratorn' path will be used for serving static content from the 'public' folder.
  app.use(baseURL, express.static(join(directoryFullName, '..', 'public')))

  app.use(baseURL, router)

  // include fallback PORT if .env is not included at runtime for Docker container.
  // .env is currently not in use
  const server = app.listen(process.env.PORT || 5005, () => {
    console.info(`Server running at http://localhost:${server.address().port}`)
  })
} catch (err) {
  console.error(err.message, { error: err })
  process.exitCode = 1
}

/*
 * Export the app for testing purposes.
 * This allows tools like Supertest to perform HTTP assertions without starting a live server.
 */
export default app
