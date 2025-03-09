<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-gray-800">FlowBoard</router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <span class="text-gray-600">{{ authStore.currentUser?.name }}</span>
            <router-link to="/board" class="btn btn-secondary">My Tasks</router-link>
            <button @click="logout" class="btn btn-secondary">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-secondary">Login</router-link>
            <router-link to="/register" class="btn btn-primary">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script> 