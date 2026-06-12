import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  let observer = null
  
  const checkFadeIn = () => {
    const elements = document.querySelectorAll('.fade-on-scroll')
    
    elements.forEach(element => {
      if (!element) return
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      if (rect.top < windowHeight - 100 && rect.bottom > 0) {
        element.classList.add('visible')
      } else {
        element.classList.remove('visible')
      }
    })
  }
  
  onMounted(() => {
    // Initial check after DOM is ready
    setTimeout(checkFadeIn, 100)
    
    window.addEventListener('scroll', checkFadeIn)
    window.addEventListener('resize', checkFadeIn)
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', checkFadeIn)
    window.removeEventListener('resize', checkFadeIn)
    if (observer) observer.disconnect()
  })
  
  return { checkFadeIn }
}