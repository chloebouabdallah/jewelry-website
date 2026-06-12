<template>
  <div class="mt-12 pt-8 border-t border-amber-200">
    <h3 class="text-2xl font-playfair font-semibold text-stone-800 mb-6">Customer Reviews</h3>
    
    <!-- Review Summary -->
    <div class="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-amber-200">
      <div class="text-center md:text-left">
        <div class="text-5xl font-bold text-amber-700">{{ averageRating }}</div>
        <div class="flex gap-1 text-amber-500 mt-2 justify-center md:justify-start">
          <i v-for="i in 5" :key="i" class="fas fa-star" :class="{ 'text-amber-300': i > Math.floor(averageRating) }"></i>
        </div>
        <p class="text-stone-500 text-sm mt-1">Based on {{ reviewCount }} reviews</p>
      </div>
      
      <!-- Rating Breakdown -->
      <div class="flex-1 space-y-2">
        <div v-for="rating in [5,4,3,2,1]" :key="rating" class="flex items-center gap-3">
          <span class="text-sm text-stone-600 w-8">{{ rating }}★</span>
          <div class="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 rounded-full" :style="{ width: `${getRatingPercentage(rating)}%` }"></div>
          </div>
          <span class="text-sm text-stone-500 w-12">{{ getRatingCount(rating) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Write a Review Button (only shows when logged in) -->
    <div v-if="authStore.isAuthenticated" class="mb-8">
      <button @click="showReviewForm = !showReviewForm" class="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition">
        <i class="fas fa-pen mr-2"></i> Write a Review
      </button>
    </div>
    <div v-else class="mb-8 p-4 bg-amber-50 rounded-xl text-center">
      <p class="text-stone-600">Please <button @click="authStore.openAuthModal('login')" class="text-amber-600 font-semibold hover:underline">login</button> to write a review.</p>
    </div>
    
    <!-- Review Form -->
    <div v-if="showReviewForm" class="mb-8 p-6 bg-amber-50 rounded-2xl">
      <h4 class="text-xl font-playfair font-semibold text-stone-800 mb-4">Write Your Review</h4>
      <form @submit.prevent="submitReview" class="space-y-4">
        <div>
          <label class="block text-stone-700 text-sm mb-2">Rating *</label>
          <div class="flex gap-2">
            <button v-for="i in 5" :key="i" type="button" @click="newReview.rating = i" class="text-2xl transition">
              <i :class="i <= newReview.rating ? 'fas fa-star text-amber-500' : 'far fa-star text-stone-400'"></i>
          </button>
          </div>
        </div>
        
        <div>
          <label class="block text-stone-700 text-sm mb-2">Review Title *</label>
          <input type="text" v-model="newReview.title" required class="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none">
        </div>
        
        <div>
          <label class="block text-stone-700 text-sm mb-2">Your Review *</label>
          <textarea v-model="newReview.comment" rows="4" required class="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"></textarea>
        </div>
        
        <div class="flex gap-3">
          <button type="submit" class="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition">Submit Review</button>
          <button type="button" @click="showReviewForm = false" class="border border-amber-600 text-amber-600 px-6 py-2 rounded-full hover:bg-amber-600 hover:text-white transition">Cancel</button>
        </div>
      </form>
    </div>
    
    <!-- Reviews List -->
    <div class="space-y-6">
      <div v-for="review in productReviews" :key="review.id" class="p-4 border border-amber-100 rounded-xl">
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="flex gap-1 text-amber-500">
              <i v-for="i in 5" :key="i" class="fas fa-star" :class="{ 'text-amber-300': i > review.rating }"></i>
            </div>
            <h4 class="font-semibold text-stone-800 mt-1">{{ review.title }}</h4>
          </div>
          <div class="text-right">
            <p class="font-medium text-stone-800">{{ review.userName }}</p>
            <p class="text-xs text-stone-400">{{ review.date }}</p>
            <span v-if="review.verified" class="text-xs text-green-600"><i class="fas fa-check-circle"></i> Verified Purchase</span>
          </div>
        </div>
        <p class="text-stone-600 mt-2">{{ review.comment }}</p>
      </div>
      
      <div v-if="productReviews.length === 0" class="text-center py-8 text-stone-400">
        <i class="fas fa-comment-dots text-4xl mb-2"></i>
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReviewsStore } from '@/stores/reviews'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    required: true
  }
})

const reviewsStore = useReviewsStore()
const authStore = useAuthStore()

const showReviewForm = ref(false)
const newReview = ref({
  rating: 5,
  title: '',
  comment: ''
})

const productReviews = computed(() => reviewsStore.getProductReviews(props.productId))
const reviewCount = computed(() => productReviews.value.length)
const averageRating = computed(() => {
  if (reviewCount.value === 0) return 0
  const sum = productReviews.value.reduce((total, r) => total + r.rating, 0)
  return (sum / reviewCount.value).toFixed(1)
})

const getRatingCount = (rating) => {
  return productReviews.value.filter(r => r.rating === rating).length
}

const getRatingPercentage = (rating) => {
  if (reviewCount.value === 0) return 0
  return (getRatingCount(rating) / reviewCount.value) * 100
}

const submitReview = () => {
  if (!authStore.isAuthenticated) {
    authStore.openAuthModal('login')
    return
  }
  
  if (!newReview.value.title || !newReview.value.comment) {
    alert('Please fill in all fields')
    return
  }
  
  reviewsStore.addReview({
    productId: props.productId,
    productName: props.productName,
    productImage: props.productImage,
    userName: authStore.currentUser?.name || authStore.currentUser?.email?.split('@')[0],
    rating: newReview.value.rating,
    title: newReview.value.title,
    comment: newReview.value.comment
  })
  
  // Reset form
  newReview.value = { rating: 5, title: '', comment: '' }
  showReviewForm.value = false
}
</script>