<template>
  <div v-if="authStore.showAuthModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="authStore.closeAuthModal()"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-fade-scale">
      <!-- Close button -->
      <button @click="authStore.closeAuthModal()" class="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition">
        <i class="fas fa-times text-xl"></i>
      </button>
      
      <!-- Logo -->
      <div class="text-center mb-6">
        <i class="fas fa-gem text-3xl text-amber-600 mb-2"></i>
        <h2 class="text-2xl font-playfair font-bold text-stone-800">SOUTOU</h2>
        <p class="text-stone-500 text-sm mt-1">Sign in to your account</p>
      </div>
      
      <!-- Login Form -->
      <div v-if="authStore.authMode === 'login'">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-stone-700 text-sm mb-2">Email Address</label>
            <input 
              type="email" 
              v-model="loginForm.email" 
              required
              class="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              placeholder="Enter your email"
            >
          </div>
          <div>
            <label class="block text-stone-700 text-sm mb-2">Password</label>
            <input 
              type="password" 
              v-model="loginForm.password" 
              required
              class="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              placeholder="Enter your password"
            >
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white py-2.5 rounded-full font-semibold hover:scale-[1.02] transition">
            Sign In
          </button>
        </form>
        <p class="text-center text-sm text-stone-600 mt-4">
          Don't have an account? 
          <button type="button" @click="authStore.authMode = 'signup'" class="text-amber-600 hover:underline font-semibold">Sign Up</button>
        </p>
      </div>
      
      <!-- Signup Form -->
      <div v-else>
        <form @submit.prevent="handleSignup" class="space-y-4">
          <div>
            <label class="block text-stone-700 text-sm mb-2">Full Name</label>
            <input 
              type="text" 
              v-model="signupForm.name" 
              required
              class="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              placeholder="Enter your name"
            >
          </div>
          <div>
            <label class="block text-stone-700 text-sm mb-2">Email Address</label>
            <input 
              type="email" 
              v-model="signupForm.email" 
              required
              class="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              placeholder="Enter your email"
            >
          </div>
          <div>
            <label class="block text-stone-700 text-sm mb-2">Password</label>
            <input 
              type="password" 
              v-model="signupForm.password" 
              required
              class="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
              placeholder="Create a password"
            >
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white py-2.5 rounded-full font-semibold hover:scale-[1.02] transition">
            Create Account
          </button>
        </form>
        <p class="text-center text-sm text-stone-600 mt-4">
          Already have an account? 
          <button type="button" @click="authStore.authMode = 'login'" class="text-amber-600 hover:underline font-semibold">Sign In</button>
        </p>
      </div>
      
      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-4">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['login-success'])
const authStore = useAuthStore()
const errorMessage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  name: '',
  email: '',
  password: ''
})

const handleLogin = async () => {
  errorMessage.value = ''
  try {
    await authStore.login(loginForm.value.email, loginForm.value.password)
    authStore.saveToLocalStorage()
    loginForm.value = { email: '', password: '' }
    emit('login-success')
  } catch (error) {
    errorMessage.value = error
  }
}

const handleSignup = async () => {
  errorMessage.value = ''
  try {
    await authStore.signup(signupForm.value.name, signupForm.value.email, signupForm.value.password)
    authStore.saveToLocalStorage()
    signupForm.value = { name: '', email: '', password: '' }
    emit('login-success')
  } catch (error) {
    errorMessage.value = error
  }
}
</script>

<style scoped>
.animate-fade-scale {
  animation: fadeScale 0.2s ease-out;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>