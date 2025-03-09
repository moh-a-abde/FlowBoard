<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Task Management Made Simple</h2>
          <p class="mb-4">Organize your tasks with our intuitive Kanban board interface. Drag and drop tasks between columns to update their status.</p>
          <router-link to="/login" class="btn btn-primary">Get Started</router-link>
        </div>
        
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Features</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Intuitive drag-and-drop interface</li>
            <li>User authentication and authorization</li>
            <li>Create and manage multiple boards</li>
            <li>Set task priorities and deadlines</li>
            <li>Real-time updates across devices</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
</script> 