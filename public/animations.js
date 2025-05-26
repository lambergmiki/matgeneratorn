const elements = document.querySelectorAll('.card.animate-me')
// Create the animation
document.addEventListener('DOMContentLoaded', () => {
  anime({
    targets: elements,
    scale: [0.5, 1],
    opacity: [0, 1],
    duration: 1000,
    delay: anime.stagger(200, { start: 500 }), // 5s delay, then 200ms between each card
    easing: 'easeOutElastic'
  })
})
