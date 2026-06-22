<template>
  <div class="overflow-x-hidden">
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Footer />
    <ToastNotification />
    <AuthModal @login-success="handleLoginSuccess" />
    <Chatbot />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import AuthModal from '@/components/AuthModal.vue'
import Chatbot from '@/components/Chatbot.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()

// Store scroll positions
const scrollPositions = ref({})
const isFirstLoad = ref(true)

// Save scroll position for current route
const saveScrollPosition = () => {
  const path = route.fullPath
  scrollPositions.value[path] = window.scrollY
}

// Restore scroll position for current route
const restoreScrollPosition = () => {
  const path = route.fullPath
  const position = scrollPositions.value[path]
  if (position !== undefined && !isFirstLoad.value) {
    setTimeout(() => {
      window.scrollTo({ top: position, behavior: 'smooth' })
    }, 150)
  }
}

// Save on scroll
const handleScroll = () => {
  if (!isFirstLoad.value) {
    saveScrollPosition()
  }
}

const handleLoginSuccess = () => {
  const added = cartStore.addPendingAfterLogin()
  if (added) {
    console.log('Product added to cart after login')
  }
}

// Watch for route changes
watch(() => route.fullPath, (newPath, oldPath) => {
  // Save old position
  if (oldPath) {
    scrollPositions.value[oldPath] = window.scrollY
  }
  // Restore new position (if not first load)
  if (!isFirstLoad.value) {
    setTimeout(restoreScrollPosition, 100)
  }
})

// Handle browser back/forward
const handlePopState = () => {
  setTimeout(restoreScrollPosition, 100)
}

onMounted(() => {
  authStore.checkAuth()
  
  // ✅ Force scroll to top on first load
  window.scrollTo(0, 0)
  
  // ✅ Mark first load as complete after 500ms
  setTimeout(() => {
    isFirstLoad.value = false
  }, 500)
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('popstate', handlePopState)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>