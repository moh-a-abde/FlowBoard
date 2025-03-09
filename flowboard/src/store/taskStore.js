import { defineStore } from 'pinia';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    isLoading: false,
    error: null
  }),
  
  getters: {
    todoTasks: (state) => state.tasks.filter(task => task.status === 'todo'),
    inProgressTasks: (state) => state.tasks.filter(task => task.status === 'inProgress'),
    doneTasks: (state) => state.tasks.filter(task => task.status === 'done'),
    
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task.id === id);
    }
  },
  
  actions: {
    // Load tasks from localStorage
    loadTasks() {
      this.isLoading = true;
      try {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          this.tasks = JSON.parse(savedTasks);
        } else {
          // Add sample tasks if none exist
          this.tasks = [
            {
              id: 1,
              title: 'Design Kanban Board UI',
              description: 'Create wireframes and mockups for the Kanban board interface',
              dueDate: '2023-12-15',
              priority: 'high',
              status: 'todo'
            },
            {
              id: 2,
              title: 'Implement Drag and Drop',
              description: 'Add drag and drop functionality to move tasks between columns',
              dueDate: '2023-12-20',
              priority: 'medium',
              status: 'inProgress'
            },
            {
              id: 3,
              title: 'User Authentication',
              description: 'Set up user login and registration',
              dueDate: '2023-12-10',
              priority: 'high',
              status: 'done'
            }
          ];
          this.saveTasks();
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Save tasks to localStorage
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    
    // Add a new task
    addTask(task) {
      const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
      this.tasks.push({ ...task, id: newId });
      this.saveTasks();
      return newId;
    },
    
    // Update an existing task
    updateTask(updatedTask) {
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = { ...updatedTask };
        this.saveTasks();
        return true;
      }
      return false;
    },
    
    // Delete a task
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.saveTasks();
    },
    
    // Move a task to a different status
    moveTask(taskId, newStatus) {
      const index = this.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        this.tasks[index].status = newStatus;
        this.saveTasks();
        return true;
      }
      return false;
    }
  }
}); 