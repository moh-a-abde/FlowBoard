<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <main class="container mx-auto px-4 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-0">My Tasks</h1>
        <button 
          @click="showAddTaskModal = true" 
          class="btn btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Task
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- To Do Column -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-indigo-700 dark:text-indigo-300">To Do</h3>
          </div>
          <div 
            class="p-4 min-h-[300px]"
            @dragover.prevent
            @drop="onDrop($event, 'todo')"
          >
            <div 
              v-for="task in taskStore.todoTasks" 
              :key="task.id"
              class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3 shadow-sm hover:shadow transition-all duration-200 cursor-move"
              draggable="true"
              @dragstart="onDragStart($event, task)"
            >
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ task.title }}</h4>
                <div class="flex space-x-1 ml-2">
                  <button @click="editTask(task)" class="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
                    <span class="sr-only">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button @click="deleteTask(task.id)" class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                    <span class="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ task.description }}</p>
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(task.dueDate) }}</span>
                </div>
                <span 
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300': task.priority === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300': task.priority === 'low'
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div v-if="taskStore.todoTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
              No tasks yet. Drag tasks here or add new ones.
            </div>
          </div>
        </div>
        
        <!-- In Progress Column -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="bg-blue-50 dark:bg-blue-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-blue-700 dark:text-blue-300">In Progress</h3>
          </div>
          <div 
            class="p-4 min-h-[300px]"
            @dragover.prevent
            @drop="onDrop($event, 'inProgress')"
          >
            <div 
              v-for="task in taskStore.inProgressTasks" 
              :key="task.id"
              class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3 shadow-sm hover:shadow transition-all duration-200 cursor-move"
              draggable="true"
              @dragstart="onDragStart($event, task)"
            >
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ task.title }}</h4>
                <div class="flex space-x-1 ml-2">
                  <button @click="editTask(task)" class="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
                    <span class="sr-only">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button @click="deleteTask(task.id)" class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                    <span class="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ task.description }}</p>
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(task.dueDate) }}</span>
                </div>
                <span 
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300': task.priority === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300': task.priority === 'low'
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div v-if="taskStore.inProgressTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
              No in-progress tasks. Drag tasks here to start working on them.
            </div>
          </div>
        </div>
        
        <!-- Done Column -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="bg-green-50 dark:bg-green-900/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-green-700 dark:text-green-300">Done</h3>
          </div>
          <div 
            class="p-4 min-h-[300px]"
            @dragover.prevent
            @drop="onDrop($event, 'done')"
          >
            <div 
              v-for="task in taskStore.doneTasks" 
              :key="task.id"
              class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3 shadow-sm hover:shadow transition-all duration-200 cursor-move"
              draggable="true"
              @dragstart="onDragStart($event, task)"
            >
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ task.title }}</h4>
                <div class="flex space-x-1 ml-2">
                  <button @click="editTask(task)" class="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
                    <span class="sr-only">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button @click="deleteTask(task.id)" class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                    <span class="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ task.description }}</p>
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(task.dueDate) }}</span>
                </div>
                <span 
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300': task.priority === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300': task.priority === 'low'
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div v-if="taskStore.doneTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
              No completed tasks. Drag tasks here when they're done.
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Add/Edit Task Modal -->
    <div v-if="showAddTaskModal || editingTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h2>
        
        <form @submit.prevent="saveTask">
          <div class="mb-4">
            <label for="title" class="block text-gray-700 mb-2">Title</label>
            <input 
              type="text" 
              id="title" 
              v-model="taskForm.title" 
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
          </div>
          
          <div class="mb-4">
            <label for="description" class="block text-gray-700 mb-2">Description</label>
            <textarea 
              id="description" 
              v-model="taskForm.description" 
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label for="dueDate" class="block text-gray-700 mb-2">Due Date</label>
            <input 
              type="date" 
              id="dueDate" 
              v-model="taskForm.dueDate" 
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div class="mb-4">
            <label for="priority" class="block text-gray-700 mb-2">Priority</label>
            <select 
              id="priority" 
              v-model="taskForm.priority" 
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label for="status" class="block text-gray-700 mb-2">Status</label>
            <select 
              id="status" 
              v-model="taskForm.status" 
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="cancelTaskModal" 
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
            >
              {{ editingTask ? 'Update' : 'Add' }} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar.vue';

const router = useRouter();
const taskStore = useTaskStore();
const authStore = useAuthStore();
const showAddTaskModal = ref(false);
const editingTask = ref(null);
const draggedTask = ref(null);

// Task form
const taskForm = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  status: 'todo'
});

// Load tasks on component mount
onMounted(() => {
  taskStore.loadTasks();
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Drag and drop handlers
const onDragStart = (event, task) => {
  draggedTask.value = task;
};

const onDrop = (event, status) => {
  if (draggedTask.value) {
    taskStore.moveTask(draggedTask.value.id, status);
    draggedTask.value = null;
  }
};

// Task CRUD operations
const editTask = (task) => {
  editingTask.value = task;
  taskForm.value = { ...task };
};

const saveTask = () => {
  if (editingTask.value) {
    // Update existing task
    taskStore.updateTask({ ...taskForm.value, id: editingTask.value.id });
  } else {
    // Add new task
    taskStore.addTask(taskForm.value);
  }
  
  cancelTaskModal();
};

const deleteTask = (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(taskId);
  }
};

const cancelTaskModal = () => {
  showAddTaskModal.value = false;
  editingTask.value = null;
};

// Logout function
const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script> 