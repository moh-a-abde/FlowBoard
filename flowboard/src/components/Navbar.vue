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
              className="mr-2 text-primary-500 dark:text-primary-400 animate-pulse-gentle" 
              title="FlowBoard Logo"
            />
            <span>FlowBoard</span>
          </router-link>
        </div>
        
        <div class="flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <span v-if="!isCollapsed" class="text-gray-600 dark:text-gray-300 text-sm hidden sm:inline-block mr-2 transition-colors-normal">
              {{ authStore.currentUser?.name }}
            </span>
            <router-link v-if="!isCollapsed" to="/board" class="btn btn-secondary text-sm py-1.5 hover-lift transition-all-normal flex items-center">
              <span class="hidden sm:inline">My Tasks</span>
              <IconManager 
                v-if="isMobile" 
                name="task-list" 
                size="20" 
                title="My Tasks"
              />
            </router-link>
            <button v-if="!isCollapsed" @click="logout" class="btn btn-secondary text-sm py-1.5 hover-lift transition-all-normal flex items-center">
              <span class="hidden sm:inline">Logout</span>
              <IconManager 
                v-if="isMobile" 
                name="logout" 
                size="20" 
                title="Logout"
              />
            </button>
          </template>
          <template v-else>
            <router-link v-if="!isCollapsed" to="/login" class="btn btn-secondary text-sm py-1.5 hover-lift transition-all-normal">Login</router-link>
            <router-link v-if="!isCollapsed" to="/register" class="btn btn-primary text-sm py-1.5 hover-lift transition-all-normal">Register</router-link>
          </template>
          
          <!-- Collapse/Expand Button -->
          <button 
            @click="toggleNavbar" 
            class="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
            :aria-label="isCollapsed ? 'Expand navbar' : 'Collapse navbar'"
          >
            <!-- Expand icon when collapsed -->
            <IconManager 
              v-if="isCollapsed" 
              name="menu" 
              size="20" 
              className="animate-scale-in" 
              title="Expand navbar"
            />
            <!-- Collapse icon when expanded -->
            <IconManager 
              v-else 
              name="menu-fold" 
              size="20" 
              className="animate-scale-in" 
              title="Collapse navbar"
            />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import IconManager from './IconManager.vue';
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