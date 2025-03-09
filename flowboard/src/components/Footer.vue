<template>
  <footer class="bg-white shadow-sm dark:bg-gray-800 py-4 mt-auto transition-colors-normal">
    <div class="container mx-auto px-4">
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-0 transition-colors-normal">
          © {{ new Date().getFullYear() }} FlowBoard. All rights reserved.
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle Button -->
          <button 
            @click="toggleDarkMode" 
            class="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
            aria-label="Toggle dark mode"
          >
            <!-- Sun icon for dark mode (show when dark mode is active) -->
            <IconManager 
              v-if="themeStore.isDarkMode" 
              name="sun" 
              size="20" 
              className="animate-scale-in" 
              title="Switch to light mode"
            />
            <!-- Moon icon for light mode (show when light mode is active) -->
            <IconManager 
              v-else 
              name="moon" 
              size="20" 
              className="animate-scale-in" 
              title="Switch to dark mode"
            />
          </button>
          <span class="text-sm text-gray-600 dark:text-gray-400 transition-colors-normal">
            {{ themeStore.isDarkMode ? 'Dark' : 'Light' }} Mode
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useThemeStore } from '../store/themeStore';
import IconManager from './IconManager.vue';

const themeStore = useThemeStore();

const toggleDarkMode = () => {
  themeStore.toggleDarkMode();
};
</script>

<style scoped>
/* Theme toggle animation */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

button[aria-label="Toggle dark mode"]:hover :deep(svg) {
  animation: rotate 0.5s ease-out;
}

/* Enhance the hover effect for the theme toggle button */
button[aria-label="Toggle dark mode"] {
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background-color: white;
  color: #374151; /* gray-700 */
}

.dark button[aria-label="Toggle dark mode"] {
  background-color: #1F2937; /* gray-800 */
  color: #D1D5DB; /* gray-300 */
}

button[aria-label="Toggle dark mode"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #F3F4F6; /* gray-100 */
}

.dark button[aria-label="Toggle dark mode"]:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  background-color: #374151; /* gray-700 */
}

button[aria-label="Toggle dark mode"]:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style> 