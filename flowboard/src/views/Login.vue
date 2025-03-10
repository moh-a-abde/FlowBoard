<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to access your tasks</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
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
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
              </div>
            </div>
            
            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <a href="#" class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">Forgot password?</a>
              </div>
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
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
              </div>
            </div>
            
            <div v-if="authStore.error" class="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
              {{ authStore.error }}
            </div>
            
            <BaseButton 
              type="submit" 
              variant="primary"
              block
              :loading="authStore.isLoading"
              icon="login"
            >
              Sign in
            </BaseButton>
          </form>
          
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account? 
              <router-link to="/register" class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Create an account
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
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value);
  if (success) {
    router.push({ name: 'board' });
  }
};
</script> 