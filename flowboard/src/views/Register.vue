<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    
    <div class="flex items-center justify-center py-12">
      <div class="max-w-md w-full">
        <div class="card">
          <h1 class="text-2xl font-bold text-center mb-6">Create an Account</h1>
          
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <label for="name" class="block text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="name" 
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>
            
            <div class="mb-4">
              <label for="email" class="block text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>
            
            <div class="mb-4">
              <label for="password" class="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>
            
            <div class="mb-6">
              <label for="confirmPassword" class="block text-gray-700 mb-2">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>
            
            <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {{ error }}
            </div>
            
            <button type="submit" class="btn btn-primary w-full" :disabled="authStore.isLoading">
              {{ authStore.isLoading ? 'Creating Account...' : 'Register' }}
            </button>
          </form>
          
          <div class="mt-4 text-center">
            <p>Already have an account? <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar.vue';

const router = useRouter();
const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');

const handleRegister = async () => {
  try {
    error.value = '';
    
    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      throw new Error('Passwords do not match');
    }
    
    const success = await authStore.register(name.value, email.value, password.value);
    if (success) {
      router.push({ name: 'board' });
    }
  } catch (err) {
    error.value = err.message || 'Failed to register. Please try again.';
  }
};
</script> 