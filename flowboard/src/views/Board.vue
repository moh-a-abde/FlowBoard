<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">My Tasks</h2>
        <button @click="showAddTaskModal = true" class="btn btn-primary">Add Task</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- To Do Column -->
        <div class="card">
          <h3 class="font-bold text-lg mb-4 text-gray-700 border-b pb-2">To Do</h3>
          <div 
            class="min-h-[200px]"
            @dragover.prevent
            @drop="onDrop($event, 'todo')"
          >
            <div 
              v-for="task in taskStore.todoTasks" 
              :key="task.id"
              class="bg-white border rounded-lg p-3 mb-2 shadow-sm cursor-move"
              draggable="true"
              @dragstart="onDragStart($event, task)"
            >
              <div class="flex justify-between">
                <h4 class="font-medium">{{ task.title }}</h4>
                <div class="flex space-x-2">
                  <button @click="editTask(task)" class="text-blue-500 hover:text-blue-700">
                    <span class="sr-only">Edit</span>
                    ✏️
                  </button>
                  <button @click="deleteTask(task.id)" class="text-red-500 hover:text-red-700">
                    <span class="sr-only">Delete</span>
                    🗑️
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
              <div class="mt-2 flex justify-between items-center">
                <span class="text-xs text-gray-500">{{ formatDate(task.dueDate) }}</span>
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-green-100 text-green-800': task.priority === 'low'
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- In Progress Column -->
        <div class="card">
          <h3 class="font-bold text-lg mb-4 text-gray-700 border-b pb-2">In Progress</h3>
          <div 
            class="min-h-[200px]"
            @dragover.prevent
            @drop="onDrop($event, 'inProgress')"
          >
            <div 
              v-for="task in taskStore.inProgressTasks" 
              :key="task.id"
              class="bg-white border rounded-lg p-3 mb-2 shadow-sm cursor-move"
              draggable="true"
              @dragstart="onDragStart($event, task)"
            >
              <div class="flex justify-between">
                <h4 class="font-medium">{{ task.title }}</h4>
                <div class="flex space-x-2">
                  <button @click="editTask(task)" class="text-blue-500 hover:text-blue-700">
                    <span class="sr-only">Edit</span>
                    ✏️
                  </button>
                  <button @click="deleteTask(task.id)" class="text-red-500 hover:text-red-700">
                    <span class="sr-only">Delete</span>
                    🗑️
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
              <div class="mt-2 flex justify-between items-center">
                <span class="text-xs text-gray-500">{{ formatDate(task.dueDate) }}</span>
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-green-100 text-green-800': task.priority === 'low'
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Done Column -->
        <div class="card">
          <h3 class="font-bold text-lg mb-4 text-gray-700 border-b pb-2">Done</h3>
          <div 
            class="min-h-[200px]"
            @dragover.prevent
            @drop="onDrop($event, 'done')"
          >
            <div 
              v-for="task in taskStore.doneTasks" 
              :key="task.id"
              class="bg-white border rounded-lg p-3 mb-2 shadow-sm cursor-move"
              draggable="true"
              @dragstart="onDragStart($event, task)"
            >
              <div class="flex justify-between">
                <h4 class="font-medium">{{ task.title }}</h4>
                <div class="flex space-x-2">
                  <button @click="editTask(task)" class="text-blue-500 hover:text-blue-700">
                    <span class="sr-only">Edit</span>
                    ✏️
                  </button>
                  <button @click="deleteTask(task.id)" class="text-red-500 hover:text-red-700">
                    <span class="sr-only">Delete</span>
                    🗑️
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
              <div class="mt-2 flex justify-between items-center">
                <span class="text-xs text-gray-500">{{ formatDate(task.dueDate) }}</span>
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-green-100 text-green-800': task.priority === 'low'
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
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