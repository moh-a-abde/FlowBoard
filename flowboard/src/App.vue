<script setup>
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const isKeyboardUser = ref(false);
const themeTransitioning = ref(false);

// Initialize auth state and theme on app load
onMounted(() => {
  authStore.init();
  themeStore.init();
  
  // Detect keyboard navigation for accessibility
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('mousedown', handleMouseDown);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('mousedown', handleMouseDown);
  
  // Clean up system theme change listener
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleSystemThemeChange);
});

// Watch for theme changes and add a transitioning class
watchEffect(() => {
  const isDark = themeStore.isDarkMode;
  themeTransitioning.value = true;
  
  // Remove the transitioning class after the transition is complete
  setTimeout(() => {
    themeTransitioning.value = false;
  }, 300);
});

// Update theme based on system preference if user hasn't explicitly set a preference
const handleSystemThemeChange = (e) => {
  // Only update theme if user hasn't explicitly chosen a theme
  if (localStorage.getItem('darkMode') === null) {
    themeStore.isDarkMode = e.matches;
    themeStore.applyTheme();
  }
};

// Set keyboard user state when Tab key is pressed
const handleKeyDown = (e) => {
  if (e.key === 'Tab') {
    isKeyboardUser.value = true;
    document.body.classList.add('keyboard-user');
  }
};

// Reset keyboard user state when mouse is used
const handleMouseDown = () => {
  isKeyboardUser.value = false;
  document.body.classList.remove('keyboard-user');
};
</script>

<template>
  <div 
    @mousedown="handleMouseDown"
    :class="{'theme-transitioning': themeTransitioning}"
  >
    <!-- Skip to content link for keyboard users -->
    <a href="#main-content" class="skip-to-content">Skip to main content</a>
    
    <router-view />
  </div>
</template>

<style>
.theme-transitioning * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
}
</style>
