const recipeCards = document.querySelectorAll('.card.animate-me')

/**
 * Wait until all images matching the selector are fully loaded (and not broken).
 *
 * @param {string} selector - CSS selector for the images to check.
 * @returns {Promise} Resolves when all images are either successfully loaded or failed (but checked).
 */
function allImagesLoaded (selector) {
  const images = document.querySelectorAll(selector)

  // Create a promise for each image
  const promises = Array.from(images).map(img => {
    // If image is done loading (complete) and not broken (naturalHeight) resolve immediately
    if (img.complete && img.naturalHeight !== 0) return Promise.resolve()

    // Otherwise, return a promise that resolves when the image either loads OR fails to load
    return new Promise(resolve => {
      img.onload = resolve
      img.onerror = resolve
    })
  })

  // Return a promise that resolves when all image promises are done
  return Promise.all(promises)
}

// Create the animation
document.addEventListener('DOMContentLoaded', () => {
  allImagesLoaded('.thumbnail img').then(() => {
    anime({
      targets: recipeCards,
      scale: [0.5, 1],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(150), // 200ms delay between each card
      easing: 'easeOutElastic'
    })
  })
})
