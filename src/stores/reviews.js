import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReviewsStore = defineStore('reviews', () => {
  // State
  const reviews = ref([])
  
  // Load reviews from localStorage
  function loadReviews() {
    const savedReviews = localStorage.getItem('soutou_reviews')
    if (savedReviews) {
      reviews.value = JSON.parse(savedReviews)
    } else {
      // Sample reviews to start with
      reviews.value = [
        {
          id: 1,
          productId: 1,
          productName: 'Celestial Diamond Necklace',
          productImage: '/necklace2.webp',
          userName: 'Sarah M.',
          rating: 5,
          title: 'Absolutely stunning!',
          comment: 'This necklace took my breath away. The craftsmanship is impeccable and the diamonds sparkle beautifully. Worth every penny!',
          date: '2024-03-15',
          verified: true
        },
        {
          id: 2,
          productId: 101,
          productName: 'Gold Earrings',
          productImage: '/earring1.avif',
          userName: 'Emma W.',
          rating: 5,
          title: 'Perfect everyday earrings',
          comment: 'These earrings are so elegant and versatile. I wear them almost every day!',
          date: '2024-03-10',
          verified: true
        },
        {
          id: 3,
          productId: 201,
          productName: 'Silver Diamond Ring',
          productImage: '/ring1.jpg',
          userName: 'James T.',
          rating: 5,
          title: 'Beautiful engagement ring',
          comment: 'My fiancée absolutely loves this ring. The diamond is brilliant and the setting is perfect.',
          date: '2024-03-05',
          verified: true
        },
        {
          id: 4,
          productId: 301,
          productName: 'Silver Diamond Bracelet',
          productImage: '/bracelet1.webp',
          userName: 'Linda K.',
          rating: 4,
          title: 'Elegant and delicate',
          comment: 'Beautiful bracelet, very delicate. Perfect for stacking with other bracelets.',
          date: '2024-02-28',
          verified: true
        }
      ]
      saveReviews()
    }
  }
  
  // Save reviews to localStorage
  function saveReviews() {
    localStorage.setItem('soutou_reviews', JSON.stringify(reviews.value))
  }
  
  // Add a new review
  function addReview(review) {
    const newId = reviews.value.length > 0 ? Math.max(...reviews.value.map(r => r.id)) + 1 : 1
    const newReview = {
      id: newId,
      ...review,
      date: new Date().toISOString().split('T')[0],
      verified: true
    }
    reviews.value.unshift(newReview) // Add to beginning
    saveReviews()
    return newReview
  }
  
  // Get reviews for a specific product
  function getProductReviews(productId) {
    return reviews.value.filter(review => review.productId === productId)
  }
  
  // Get average rating for a product
  function getProductRating(productId) {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((total, review) => total + review.rating, 0)
    return (sum / productReviews.length).toFixed(1)
  }
  
  // Get review count for a product
  function getReviewCount(productId) {
    return getProductReviews(productId).length
  }
  
  // Get all reviews for the reviews page
  const allReviews = computed(() => reviews.value)
  
  // Get recent reviews (limit 10)
  const recentReviews = computed(() => reviews.value.slice(0, 10))
  
  // Get reviews by rating
  function getReviewsByRating(rating) {
    return reviews.value.filter(review => review.rating === rating)
  }
  
  // Get overall average rating
  const overallRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const sum = reviews.value.reduce((total, review) => total + review.rating, 0)
    return (sum / reviews.value.length).toFixed(1)
  })
  
  // Initialize
  loadReviews()
  
  return {
    reviews,
    allReviews,
    recentReviews,
    overallRating,
    addReview,
    getProductReviews,
    getProductRating,
    getReviewCount,
    getReviewsByRating,
    loadReviews,
    saveReviews
  }
})