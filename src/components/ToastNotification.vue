<template>
  <!-- Success Toast -->
  <Transition name="toast">
    <div v-if="cartStore.lastAddedMessage" class="fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-full text-sm z-[1000] shadow-lg">
      <i class="fas fa-check-circle mr-2"></i> {{ cartStore.lastAddedMessage }}
    </div>
  </Transition>
  
  <!-- Auth Required Toast -->
  <Transition name="toast">
    <div v-if="cartStore.authRequiredMessage" class="fixed bottom-5 right-5 bg-amber-600 text-white px-5 py-3 rounded-full text-sm z-[1000] shadow-lg">
      <i class="fas fa-exclamation-triangle mr-2"></i> {{ cartStore.authRequiredMessage }}
    </div>
  </Transition>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>