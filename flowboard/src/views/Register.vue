<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Get started with FlowBoard today</p>
          </div>
          
          <form @submit.prevent="handleRegister" class="space-y-5">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconManager 
                    name="user" 
                    size="20" 
                    className="text-gray-400" 
                    title="Name"
                  />
                </div>
                <input 
                  type="text" 
                  id="name" 
                  v-model="name"
                  placeholder="John Doe"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  required
                >
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconManager 
                    name="email" 
                    size="20" 
                    className="text-gray-400" 
                    title="Email"
                  />
                </div>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email"
                  placeholder="you@example.com"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  required
                >
              </div>
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconManager 
                    name="lock" 
                    size="20" 
                    className="text-gray-400" 
                    title="Password"
                  />
                </div>
                <input 
                  type="password" 
                  id="password" 
                  v-model="password"
                  placeholder="••••••••" 
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  required
                >
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters</p>
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconManager 
                    name="lock" 
                    size="20" 
                    className="text-gray-400" 
                    title="Confirm Password"
                  />
                </div>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="confirmPassword"
                  placeholder="••••••••" 
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  required
                >
              </div>
            </div>
            
            <div v-if="error" class="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
              {{ error }}
            </div>
            
            <BaseButton 
              type="submit" 
              variant="primary"
              block
              :loading="authStore.isLoading"
              icon="user-plus"
            >
              {{ authStore.isLoading ? 'Creating account...' : 'Create account' }}
            </BaseButton>
          </form>
          
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Already have an account? 
              <router-link to="/login" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Sign in
              </router-link>
            </p>
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
import IconManager from '../components/IconManager.vue';
import BaseButton from '../components/BaseButton.vue';

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