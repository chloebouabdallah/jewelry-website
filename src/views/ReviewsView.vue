<template>
  <main>
    <!-- Hero -->
    <section class="pt-32 pb-12 px-5 bg-gradient-to-br from-[#f5e6d8] via-[#efe0d2] to-[#f5e6d8]">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="font-playfair text-4xl md:text-5xl lg:text-6xl font-light text-stone-800 mb-4">Customer Reviews</h1>
        <div class="w-24 h-0.5 bg-amber-500 mx-auto mb-6"></div>
        <p class="text-stone-600 max-w-2xl mx-auto">See what our customers are saying about their SOUTOU experience.</p>
      </div>
    </section>

    <!-- Reviews Summary -->
    <section class="py-10 px-5">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white rounded-2xl shadow-md p-8 mb-10">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="text-center">
              <div class="text-6xl font-bold text-amber-700">{{ overallRating }}</div>
              <div class="flex gap-1 text-amber-500 mt-2 justify-center">
                <i v-for="i in 5" :key="i" class="fas fa-star" :class="{ 'text-amber-300': i > Math.floor(overallRating) }"></i>
              </div>
              <p class="text-stone-500 text-sm mt-1">Based on {{ totalReviews }} reviews</p>
            </div>
            
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
        </div>
        
        <!-- Filter Buttons -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button 
            v-for="rating in ['all', 5, 4, 3, 2, 1]" 
            :key="rating"
            @click="selectedRating = rating"
            class="px-4 py-2 rounded-full transition"
            :class="selectedRating === rating ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'"
          >
            {{ rating === 'all' ? 'All Reviews' : `${rating} Stars` }}
          </button>
        </div>
        
        <!-- Reviews Grid -->
        <div v-if="filteredReviews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="review in filteredReviews" :key="review.id" class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <div class="p-5">
              <div class="flex gap-1 text-amber-500 mb-2">
                <i v-for="i in 5" :key="i" class="fas fa-star" :class="{ 'text-amber-300': i > review.rating }"></i>
              </div>
              <h3 class="font-playfair text-lg font-semibold text-stone-800 mb-2">{{ review.title }}</h3>
              <p class="text-stone-600 text-sm mb-4 line-clamp-3">{{ review.comment }}</p>
              
              <div class="flex items-center gap-3 mb-3">
                <router-link :to="`/product/${review.productId}`" class="flex items-center gap-2 group">
                  <img :src="review.productImage" :alt="review.productName" class="w-10 h-10 object-cover rounded-lg">
                  <span class="text-sm text-amber-600 group-hover:underline">{{ review.productName }}</span>
                </router-link>
              </div>
              
              <div class="flex justify-between items-center pt-2 border-t border-amber-100">
                <div>
                  <p class="font-medium text-stone-800 text-sm">{{ review.userName }}</p>
                  <p class="text-xs text-stone-400">{{ review.date }}</p>
                </div>
                <span v-if="review.verified" class="text-xs text-green-600"><i class="fas fa-check-circle"></i> Verified</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <i class="fas fa-comments text-5xl text-amber-300 mb-4"></i>
          <p class="text-stone-500">No reviews found for this rating.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useReviewsStore } from '@/stores/reviews'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()

const reviewsStore = useReviewsStore()
const selectedRating = ref('all')

const totalReviews = computed(() => reviewsStore.allReviews.length)
const overallRating = computed(() => reviewsStore.overallRating)

const getRatingCount = (rating) => {
  return reviewsStore.getReviewsByRating(rating).length
}

const getRatingPercentage = (rating) => {
  if (totalReviews.value === 0) return 0
  return (getRatingCount(rating) / totalReviews.value) * 100
}

const filteredReviews = computed(() => {
  if (selectedRating.value === 'all') {
    return reviewsStore.allReviews
  }
  return reviewsStore.getReviewsByRating(selectedRating.value)
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>