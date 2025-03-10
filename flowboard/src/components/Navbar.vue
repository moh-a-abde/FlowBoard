<template>
  <nav :class="[
    'bg-white shadow-sm dark:bg-gray-800 sticky top-0 z-10 transition-colors-normal',
    isCollapsed ? 'navbar-collapsed' : ''
  ]">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-primary-500 dark:text-primary-400 flex items-center transition-colors-normal hover-lift">
            <IconManager 
              name="flow-wave" 
              size="24" 
              className="mr-2 text-black dark:text-white animate-pulse-gentle" 
              title="FlowBoard Logo"
            />
            <span>FlowBoard</span>
          </router-link>
        </div>
        
        <div class="flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <span v-if="!isCollapsed" class="text-black dark:text-blue-400 text-sm hidden sm:inline-block mr-2 transition-colors-normal">
              {{ authStore.currentUser?.name }}
            </span>
            <BaseButton 
              v-if="!isCollapsed" 
              variant="secondary" 
              size="sm" 
              :icon="isMobile ? 'task-list' : ''" 
              :iconOnly="isMobile" 
              @click="$router.push('/board')"
            >
              My Tasks
            </BaseButton>
            <BaseButton 
              v-if="!isCollapsed" 
              variant="secondary" 
              size="sm" 
              :icon="isMobile ? 'logout' : ''" 
              :iconOnly="isMobile" 
              @click="logout"
            >
              Logout
            </BaseButton>
          </template>
          <template v-else>
            <BaseButton 
              v-if="!isCollapsed" 
              variant="secondary" 
              size="sm" 
              @click="$router.push('/login')"
            >
              Login
            </BaseButton>
            <BaseButton 
              v-if="!isCollapsed" 
              variant="primary" 
              size="sm" 
              @click="$router.push('/register')"
            >
              Register
            </BaseButton>
          </template>
          
          <!-- Collapse/Expand Button -->
          <BaseButton 
            variant="secondary" 
            iconOnly 
            :icon="isCollapsed ? 'menu' : 'menu-fold'" 
            :iconTitle="isCollapsed ? 'Expand navbar' : 'Collapse navbar'" 
            :iconClass="'animate-scale-in'" 
            className="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
            @click="toggleNavbar"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import IconManager from './IconManager.vue';
import BaseButton from './BaseButton.vue';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('sm');
const isCollapsed = ref(false);

const logout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};

const toggleNavbar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('navbarCollapsed', isCollapsed.value.toString());
};

// Initialize collapsed state from localStorage on component mount
onMounted(() => {
  const savedState = localStorage.getItem('navbarCollapsed');
  if (savedState !== null) {
    isCollapsed.value = savedState === 'true';
  }
});
</script>

<style scoped>
.btn {
  min-width: 70px;
  box-shadow: 0 2px 4px rgba(0, 105, 255, 0.1);
}

@media (max-width: 640px) {
  .btn {
    min-width: 40px;
    padding: 0.5rem;
  }
}

/* Navbar toggle animation */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

button[aria-label="Collapse navbar"]:hover :deep(svg),
button[aria-label="Expand navbar"]:hover :deep(svg) {
  animation: rotate 0.5s ease-out;
}

/* Enhance the hover effect for the navbar toggle button */
button[aria-label="Collapse navbar"],
button[aria-label="Expand navbar"] {
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background-color: white;
  color: #374151; /* gray-700 */
}

.dark button[aria-label="Collapse navbar"],
.dark button[aria-label="Expand navbar"] {
  background-color: #1F2937; /* gray-800 */
  color: #D1D5DB; /* gray-300 */
}

button[aria-label="Collapse navbar"]:hover,
button[aria-label="Expand navbar"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #F3F4F6; /* gray-100 */
}

.dark button[aria-label="Collapse navbar"]:hover,
.dark button[aria-label="Expand navbar"]:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  background-color: #374151; /* gray-700 */
}

button[aria-label="Collapse navbar"]:active,
button[aria-label="Expand navbar"]:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Collapsed navbar styles */
.navbar-collapsed {
  width: auto;
}

.navbar-collapsed .container {
  width: auto;
}
</style> 