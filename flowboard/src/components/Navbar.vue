<template>
  <nav class="bg-white shadow-sm dark:bg-gray-800 sticky top-0 z-10">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
            <span class="mr-2">🌊</span>
            <span>FlowBoard</span>
          </router-link>
        </div>
        
        <div class="flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <span class="text-gray-600 dark:text-gray-300 text-sm hidden sm:inline-block mr-2">
              {{ authStore.currentUser?.name }}
            </span>
            <router-link to="/board" class="btn btn-secondary text-sm py-1.5">
              <span class="hidden sm:inline">My Tasks</span>
              <span class="sm:hidden">📋</span>
            </router-link>
            <button @click="logout" class="btn btn-secondary text-sm py-1.5">
              <span class="hidden sm:inline">Logout</span>
              <span class="sm:hidden">🚪</span>
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-secondary text-sm py-1.5">Login</router-link>
            <router-link to="/register" class="btn btn-primary text-sm py-1.5">Register</router-link>
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

<style scoped>
.btn {
  min-width: 70px;
}

@media (max-width: 640px) {
  .btn {
    min-width: 40px;
  }
}
</style> 