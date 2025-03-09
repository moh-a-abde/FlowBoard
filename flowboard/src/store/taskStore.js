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
    },
    
    // Get tasks filtered by tag ids
    getTasksByTags: (state) => (tagIds) => {
      if (!tagIds || tagIds.length === 0) return state.tasks;
      return state.tasks.filter(task => 
        task.tags && task.tags.some(tagId => tagIds.includes(tagId))
      );
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
              status: 'todo',
              tags: [4], // UI/UX tag
              comments: [],
              activityLog: [
                {
                  type: 'created',
                  timestamp: new Date().toISOString(),
                  message: 'Task created'
                }
              ]
            },
            {
              id: 2,
              title: 'Implement Drag and Drop',
              description: 'Add drag and drop functionality to move tasks between columns',
              dueDate: '2023-12-20',
              priority: 'medium',
              status: 'inProgress',
              tags: [1, 4], // Feature and UI/UX tags
              comments: [],
              activityLog: [
                {
                  type: 'created',
                  timestamp: new Date().toISOString(),
                  message: 'Task created'
                },
                {
                  type: 'status',
                  timestamp: new Date().toISOString(),
                  message: 'Status changed from todo to inProgress'
                }
              ]
            },
            {
              id: 3,
              title: 'User Authentication',
              description: 'Set up user login and registration',
              dueDate: '2023-12-10',
              priority: 'high',
              status: 'done',
              tags: [1, 3], // Feature and Documentation tags
              comments: [],
              activityLog: [
                {
                  type: 'created',
                  timestamp: new Date().toISOString(),
                  message: 'Task created'
                },
                {
                  type: 'status',
                  timestamp: new Date().toISOString(),
                  message: 'Status changed from todo to inProgress'
                },
                {
                  type: 'status',
                  timestamp: new Date().toISOString(),
                  message: 'Status changed from inProgress to done'
                }
              ]
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
      // Ensure task has a tags array even if empty
      const taskWithTags = { 
        ...task, 
        id: newId,
        tags: task.tags || [],
        comments: [],
        activityLog: [
          {
            type: 'created',
            timestamp: new Date().toISOString(),
            message: 'Task created'
          }
        ]
      };
      this.tasks.push(taskWithTags);
      this.saveTasks();
      return newId;
    },
    
    // Update an existing task
    updateTask(updatedTask) {
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        const oldTask = this.tasks[index];
        
        // Add activity log entries for changes
        const activityLog = oldTask.activityLog || [];
        
        if (oldTask.title !== updatedTask.title) {
          activityLog.push({
            type: 'title',
            timestamp: new Date().toISOString(),
            message: `Title changed from "${oldTask.title}" to "${updatedTask.title}"`
          });
        }
        
        if (oldTask.description !== updatedTask.description) {
          activityLog.push({
            type: 'description',
            timestamp: new Date().toISOString(),
            message: 'Description updated'
          });
        }
        
        if (oldTask.priority !== updatedTask.priority) {
          activityLog.push({
            type: 'priority',
            timestamp: new Date().toISOString(),
            message: `Priority changed from ${oldTask.priority} to ${updatedTask.priority}`
          });
        }
        
        if (oldTask.dueDate !== updatedTask.dueDate) {
          activityLog.push({
            type: 'dueDate',
            timestamp: new Date().toISOString(),
            message: `Due date changed from ${oldTask.dueDate || 'none'} to ${updatedTask.dueDate || 'none'}`
          });
        }
        
        // Ensure task has a tags array and comments array even if empty
        this.tasks[index] = { 
          ...updatedTask,
          tags: updatedTask.tags || [],
          comments: oldTask.comments || [],
          activityLog
        };
        
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
        const oldStatus = this.tasks[index].status;
        this.tasks[index].status = newStatus;
        
        // Add to activity log
        if (!this.tasks[index].activityLog) {
          this.tasks[index].activityLog = [];
        }
        
        this.tasks[index].activityLog.push({
          type: 'status',
          timestamp: new Date().toISOString(),
          message: `Status changed from ${oldStatus} to ${newStatus}`
        });
        
        this.saveTasks();
        return true;
      }
      return false;
    },
    
    // Add a tag to a task
    addTagToTask(taskId, tagId) {
      const index = this.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        // Initialize tags array if it doesn't exist
        if (!this.tasks[index].tags) {
          this.tasks[index].tags = [];
        }
        
        // Only add the tag if it's not already on the task
        if (!this.tasks[index].tags.includes(tagId)) {
          this.tasks[index].tags.push(tagId);
          
          // Add to activity log
          if (!this.tasks[index].activityLog) {
            this.tasks[index].activityLog = [];
          }
          
          this.tasks[index].activityLog.push({
            type: 'tag',
            timestamp: new Date().toISOString(),
            message: `Tag added to task`
          });
          
          this.saveTasks();
          return true;
        }
      }
      return false;
    },
    
    // Remove a tag from a task
    removeTagFromTask(taskId, tagId) {
      const index = this.tasks.findIndex(t => t.id === taskId);
      if (index !== -1 && this.tasks[index].tags) {
        this.tasks[index].tags = this.tasks[index].tags.filter(t => t !== tagId);
        
        // Add to activity log
        if (!this.tasks[index].activityLog) {
          this.tasks[index].activityLog = [];
        }
        
        this.tasks[index].activityLog.push({
          type: 'tag',
          timestamp: new Date().toISOString(),
          message: `Tag removed from task`
        });
        
        this.saveTasks();
        return true;
      }
      return false;
    },
    
    // Add a comment to a task
    addComment(taskId, commentText) {
      const index = this.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        // Initialize comments array if it doesn't exist
        if (!this.tasks[index].comments) {
          this.tasks[index].comments = [];
        }
        
        const newComment = {
          id: this.tasks[index].comments.length > 0 
            ? Math.max(...this.tasks[index].comments.map(c => c.id)) + 1 
            : 1,
          text: commentText,
          timestamp: new Date().toISOString(),
          isEdited: false
        };
        
        this.tasks[index].comments.push(newComment);
        
        // Add to activity log
        if (!this.tasks[index].activityLog) {
          this.tasks[index].activityLog = [];
        }
        
        this.tasks[index].activityLog.push({
          type: 'comment',
          timestamp: new Date().toISOString(),
          message: 'Comment added to task'
        });
        
        this.saveTasks();
        return newComment.id;
      }
      return false;
    },
    
    // Edit a comment on a task
    editComment(taskId, commentId, newText) {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1 && this.tasks[taskIndex].comments) {
        const commentIndex = this.tasks[taskIndex].comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          this.tasks[taskIndex].comments[commentIndex].text = newText;
          this.tasks[taskIndex].comments[commentIndex].isEdited = true;
          
          // Add to activity log
          if (!this.tasks[taskIndex].activityLog) {
            this.tasks[taskIndex].activityLog = [];
          }
          
          this.tasks[taskIndex].activityLog.push({
            type: 'comment',
            timestamp: new Date().toISOString(),
            message: 'Comment edited'
          });
          
          this.saveTasks();
          return true;
        }
      }
      return false;
    },
    
    // Delete a comment from a task
    deleteComment(taskId, commentId) {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1 && this.tasks[taskIndex].comments) {
        this.tasks[taskIndex].comments = this.tasks[taskIndex].comments.filter(c => c.id !== commentId);
        
        // Add to activity log
        if (!this.tasks[taskIndex].activityLog) {
          this.tasks[taskIndex].activityLog = [];
        }
        
        this.tasks[taskIndex].activityLog.push({
          type: 'comment',
          timestamp: new Date().toISOString(),
          message: 'Comment deleted from task'
        });
        
        this.saveTasks();
        return true;
      }
      return false;
    }
  }
}); 