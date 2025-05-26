import axios from 'axios'
import { setCategorySkipLookup } from '../utility/categorySkipvalues.js'

/**
 * @file Preloads and caches recipe pagination data to avoid repeated and/or multiple API calls.
 * @module preloadTotalCount
 */

const API_ENDPOINT = 'https://arla.se/cvi/facet/api/sv/recipes'
const PAGE_SIZE = 20
const CACHE_TIME = 1000 * 60 * 60 * 24 * 7 // 1 week

const baseTags = {
  weekday: 'tdb:7007',
  weekend: 'tdb:6985'
}

/**
 * Categories of food and their respective ID.
 * Used with base tags to filter API calls.
 */
const categories = [
  { name: 'beef', id: 'tdb:6600' },
  { name: 'chicken', id: 'tdb:6547' },
  { name: 'pork', id: 'tdb:6594' },
  { name: 'fish', id: 'tdb:6549' },
  { name: 'vegetarian', id: 'tdb:6517' },
  { name: 'dessert', id: 'tdb:7013' }
]

let lastFetch = 0

/**
 * Preloads and caches the total recipe counts for each category and time period.
 * Converts total counts into arrays of skip values (pagination offsets).
 * Skip values are stored in memory and passed to recipe service logic.
 *
 * Example output stored in memory:
 * {
 * "tdb:6600": { weekdaySkips: [0, 20, 40, ...], weekendSkips: [...] },
 * ...
 * }
 *
 * @returns {void}
 */
export async function preloadTotalCount () {
  const categorySkipLookup = {}
  const now = Date.now()

  // Use cached data if it's still valid.
  if (now - lastFetch < CACHE_TIME) {
    console.log('Skip data still fresh (< 1 week), skipping fetch of totalCounts')
    return
  }

  for (const { id } of categories) {
    // Initialize with empty arrays
    categorySkipLookup[id] = { weekdaySkips: [], weekendSkips: [] }

    // Build API URLs for weekday and weekend totalCount requests using category ID.
    const weekdayCountUrl = `${API_ENDPOINT}?tags=${baseTags.weekday}&tags=${id}`
    const weekendCountUrl = `${API_ENDPOINT}?tags=${baseTags.weekend}&tags=${id}`

    try {
      // Fetch both totalCounts in parallel
      const [weekdayCountResponse, weekendCountResponse] = await Promise.all([
        axios.get(weekdayCountUrl),
        axios.get(weekendCountUrl)
      ])

      // Nullish coalescing operator to return right hand side if left hand side is null/undefined.
      const weekdayTotalCount = weekdayCountResponse.data?.gridCards?.totalCount ?? 0
      const weekendTotalCount = weekendCountResponse.data?.gridCards?.totalCount ?? 0

      // Compute how many full 20‐item pages exist for each category, not accounting for leftovers.
      const weekdayPageCount = Math.floor(weekdayTotalCount / PAGE_SIZE)
      const weekendPageCount = Math.floor(weekendTotalCount / PAGE_SIZE)

      // Build skip arrays [0, 20, 40, …] for weekday/weekend respectively
      // Each skip value represents a page offset (i.e. 0 = 1, 20 = 2, ...)
      categorySkipLookup[id].weekdaySkips = Array.from(
        { length: weekdayPageCount },
        (_, pageIndex) => pageIndex * PAGE_SIZE
      )
      categorySkipLookup[id].weekendSkips = Array.from(
        { length: weekendPageCount },
        (_, pageIndex) => pageIndex * PAGE_SIZE
      )
    } catch (err) {
      console.error(`Error fetching count for tag "${id}":`, err)
      // Leave skip arrays empty → fallback to default skip=0
    }
    // Delay between requests to reduce load and not get timed out by API.
    await new Promise(resolve => setTimeout(resolve, 600))
  }
  setCategorySkipLookup(categorySkipLookup)
  lastFetch = Date.now()
  console.log('preloadTotalCount has finished')
}
