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
import path from 'path' // 'path' module handles file paths correctly
import { fileURLToPath } from 'node:url'
import { router } from './router/router.js'

try {
  const app = express()

  // Determine the absolute path to the 'public' folder dynamically.
  // We use 'path.join' and '__dirname' to ensure the correct path is resolved regardless of the environment.
  const directoryFullName = path.dirname(fileURLToPath(import.meta.url)) // Get the directory of this file
  const publicPath = path.join(directoryFullName, 'public') // Resolve the full path to the 'public' folder

  app.set('trust proxy', 1) // Trust the first proxy, Nginx, to pass the real client IP via X-Forwarded-For

  app.set('view engine', 'ejs')
  app.set('views', 'src/views')

  app.use(logger('dev'))
  app.use(helmet())
  app.use(express.json())

  app.use('/matgeneratorn', router)

  // Serve static files such as CSS, images, and JavaScript.
  // The '/matgeneratorn' path will be used for serving static content (like CSS files) from the 'public' folder.
  app.use('/matgeneratorn', express.static(publicPath))

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
