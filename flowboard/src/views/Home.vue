<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <main class="container mx-auto px-4 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Simplify Your <span class="text-indigo-600 dark:text-indigo-400">Workflow</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          FlowBoard helps you organize tasks, track progress, and boost productivity with a beautiful, intuitive interface.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/register" class="btn btn-primary px-6 py-3 text-base">Get Started</router-link>
          <router-link to="/login" class="btn btn-secondary px-6 py-3 text-base">Sign In</router-link>
        </div>
      </div>
      
      <!-- Features Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-5px]">
          <div class="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Drag & Drop Interface</h3>
          <p class="text-gray-600 dark:text-gray-300">Easily move tasks between columns with our intuitive drag-and-drop interface.</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-5px]">
          <div class="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Task Prioritization</h3>
          <p class="text-gray-600 dark:text-gray-300">Set priorities and deadlines to keep track of your most important tasks.</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-5px]">
          <div class="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure & Reliable</h3>
          <p class="text-gray-600 dark:text-gray-300">Your data is protected with user authentication and secure storage.</p>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div class="bg-indigo-600 dark:bg-indigo-700 rounded-lg shadow-xl p-8 text-center">
        <h2 class="text-2xl font-bold text-white mb-4">Ready to streamline your workflow?</h2>
        <p class="text-indigo-100 mb-6 max-w-2xl mx-auto">Join thousands of users who are already enjoying the benefits of FlowBoard.</p>
        <router-link to="/register" class="inline-block bg-white text-indigo-600 font-medium py-3 px-6 rounded-md shadow-sm hover:bg-gray-100 transition-colors">
          Start Free Today
        </router-link>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="container mx-auto px-4 py-8 mt-12 border-t border-gray-200 dark:border-gray-700">
      <div class="text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2023 FlowBoard. All rights reserved.</p>
        <p class="mt-2">Designed with ❤️ for productivity</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
</script> 