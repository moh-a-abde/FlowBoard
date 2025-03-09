<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './store/authStore';

const authStore = useAuthStore();

// Initialize auth state on app load
onMounted(() => {
  authStore.init();
});
</script>

<template>
  <router-view />
</template>

<style>
/* Global styles can go here if needed */
</style>
