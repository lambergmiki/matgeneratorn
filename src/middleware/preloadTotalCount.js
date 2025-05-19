import axios from 'axios'
import { setCategorySkipLookup } from '../utility/categorySkipvalues.js'

const API_ENDPOINT = 'https://arla.se/cvi/facet/api/sv/recipes'
const PAGE_SIZE = 20

const CACHE_TIME = 1000 * 60 * 60 * 24 * 7 // 1 week

const baseTags = {
  weekday: 'tdb:7007',
  weekend: 'tdb:6985'
}

/**
 * Categories of food and their respective ID.
 * Applied to get request with base tags based on user selection.
 */
const categories = [
  { name: 'beef', id: 'tdb:6600' },
  { name: 'chicken', id: 'tdb:6547' },
  { name: 'pork', id: 'tdb:6594' },
  { name: 'fish', id: 'tdb:6549' },
  { name: 'vegetarian', id: 'tdb:6517' },
  { name: 'dessert', id: 'tdb:7013' }
]

/**
 * Helps avoid re-fetching count data repeatedly in future API calls.
 * Fetched data is kept in memory as it is such a small amount of data.
 *
 * Output form of categorySkipLookup:
 * {
 * tdb:xxxx:      { weekdaySkips: [...], weekendSkips: [...] },
 * tdb:yyyy:   { weekdaySkips: [...], weekendSkips: [...] },
 * ...
 * }.
 *
 * @returns {object} - Returns the in-memory object with precomputed skip arrays.
 */
let lastFetch = 0
/**
 * Preloads and caches the total count of recipes for each category and time period (weekday/weekend).
 * Updates the category skip lookup with fresh data if the cache has expired.
 */
export async function preloadTotalCount () {
  const categorySkipLookup = {}
  const now = Date.now()

  if (now - lastFetch < CACHE_TIME) {
    console.log('Skip data still fresh (< 1 week), skipping fetch of totalCounts') // debugger
    return
  }

  for (const { id } of categories) {
    // Initialize with empty arrays
    categorySkipLookup[id] = { weekdaySkips: [], weekendSkips: [] }

    // Build URLs for weekday and weekend count requests using category ID.
    const weekdayCountUrl = `${API_ENDPOINT}?tags=${baseTags.weekday}&tags=${id}`
    const weekendCountUrl = `${API_ENDPOINT}?tags=${baseTags.weekend}&tags=${id}`
    console.log(weekdayCountUrl)
    console.log(weekendCountUrl)
    try {
      // Fetch both totalCounts in parallel
      const [weekdayCountResponse, weekendCountResponse] = await Promise.all([
        axios.get(weekdayCountUrl),
        axios.get(weekendCountUrl)
      ])
      console.log(weekdayCountResponse.data.gridCards.totalCount)
      console.log(weekendCountResponse.data.gridCards.totalCount)

      // console.log(weekdayCountResponse.gridCards.items.totalCount)
      // Nullish coalescing operator to return right hand side if left hand side is null/undefined.
      const weekdayTotalCount = weekdayCountResponse.data?.gridCards?.totalCount ?? 0
      const weekendTotalCount = weekendCountResponse.data?.gridCards?.totalCount ?? 0

      // Compute how many full 20‐item pages exist for each category, not accounting for leftovers.
      const weekdayPageCount = Math.floor(weekdayTotalCount / PAGE_SIZE)
      const weekendPageCount = Math.floor(weekendTotalCount / PAGE_SIZE)

      // Build skip arrays [0, 20, 40, …] for weekday/weekend respectively
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
      // Leave the skip arrays empty so getRecipes() will default to skip=0
    }
    // Wait 400ms before next category request as to not time out.
    await new Promise(resolve => setTimeout(resolve, 600))
  }
  setCategorySkipLookup(categorySkipLookup)
  lastFetch = Date.now()
  console.log('preloadTotalCount has finished') // debugger
}
