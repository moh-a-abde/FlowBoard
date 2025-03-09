<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    
    <div class="flex items-center justify-center py-12">
      <div class="max-w-md w-full">
        <div class="card">
          <h1 class="text-2xl font-bold text-center mb-6">Login to FlowBoard</h1>
          
          <form @submit.prevent="handleLogin">
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
            
            <div class="mb-6">
              <label for="password" class="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>
            
            <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {{ authStore.error }}
            </div>
            
            <button type="submit" class="btn btn-primary w-full" :disabled="authStore.isLoading">
              {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
          
          <div class="mt-4 text-center">
            <p>Don't have an account? <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link></p>
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
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value);
  if (success) {
    router.push({ name: 'board' });
  }
};
</script> 