<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors-normal flex flex-col">
    <Navbar />
    
    <!-- Dashboard for logged in users -->
    <main v-if="authStore.isAuthenticated" id="main-content" class="container mx-auto px-4 py-8 animate-slide-in-bottom flex-grow">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Your Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-300">
          Track your tasks, manage your workflow, and stay productive.
        </p>
      </div>
      
      <!-- Task Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Tasks Card -->
        <div class="card border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 transition-all-normal hover-lift relative overflow-hidden bg-white dark:bg-gray-800">
          <!-- Blue Left Border Accent -->
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 dark:bg-primary-400"></div>
          
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors-normal">Total Tasks</p>
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors-normal">{{ taskStore.tasks.length }}</h3>
            </div>
            <div class="rounded-md bg-primary-100 dark:bg-primary-800/30 p-2 transition-colors-normal">
              <IconManager 
                name="list" 
                size="20" 
                className="text-primary-600 dark:text-primary-400 transition-colors-normal" 
                title="Total Tasks"
              />
            </div>
          </div>
          <div class="mt-4">
            <button @click="showTaskPopup('all')" class="flex items-center justify-center w-full py-2 px-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-800/30 text-primary-600 dark:text-primary-400 font-medium rounded-md transition-colors-normal">
              View all 
              <span class="ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform-normal">→</span>
            </button>
          </div>
        </div>
        
        <!-- To Do Tasks Card -->
        <div class="card border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 transition-all-normal hover-lift relative overflow-hidden bg-white dark:bg-gray-800">
          <!-- Blue Left Border Accent -->
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400"></div>
          
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors-normal">To Do</p>
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors-normal">{{ taskStore.todoTasks.length }}</h3>
            </div>
            <div class="rounded-md bg-blue-100 dark:bg-blue-800/20 p-2 transition-colors-normal">
              <IconManager 
                name="todo" 
                size="20" 
                className="text-blue-600 dark:text-blue-400 transition-colors-normal" 
                title="To Do Tasks"
              />
            </div>
          </div>
          <div class="mt-4">
            <button @click="showTaskPopup('todo')" class="flex items-center justify-center w-full py-2 px-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400 font-medium rounded-md transition-colors-normal">
              View to-do 
              <span class="ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform-normal">→</span>
            </button>
          </div>
        </div>
        
        <!-- Completed Tasks Card -->
        <div class="card border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 transition-all-normal hover-lift relative overflow-hidden bg-white dark:bg-gray-800">
          <!-- Green Left Border Accent -->
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500 dark:bg-green-400"></div>
          
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors-normal">Completed</p>
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors-normal">{{ taskStore.doneTasks.length }}</h3>
            </div>
            <div class="rounded-md bg-green-100 dark:bg-green-800/20 p-2 transition-colors-normal">
              <IconManager 
                name="check" 
                size="20" 
                className="text-green-600 dark:text-green-400 transition-colors-normal" 
                title="Completed Tasks"
              />
            </div>
          </div>
          <div class="mt-4">
            <button @click="showTaskPopup('done')" class="flex items-center justify-center w-full py-2 px-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400 font-medium rounded-md transition-colors-normal">
              View completed 
              <span class="ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform-normal">→</span>
            </button>
          </div>
        </div>
        
        <!-- In Progress Tasks Card -->
        <div class="card border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 transition-all-normal hover-lift relative overflow-hidden bg-white dark:bg-gray-800">
          <!-- Yellow Left Border Accent -->
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 dark:bg-yellow-400"></div>
          
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors-normal">In Progress</p>
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors-normal">{{ taskStore.inProgressTasks.length }}</h3>
            </div>
            <div class="rounded-md bg-yellow-100 dark:bg-yellow-800/20 p-2 transition-colors-normal">
              <IconManager 
                name="in-progress" 
                size="20" 
                className="text-yellow-600 dark:text-yellow-400 transition-colors-normal" 
                title="In Progress Tasks"
              />
            </div>
          </div>
          <div class="mt-4">
            <button @click="showTaskPopup('inProgress')" class="flex items-center justify-center w-full py-2 px-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-800/30 text-yellow-600 dark:text-yellow-400 font-medium rounded-md transition-colors-normal">
              View in-progress 
              <span class="ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform-normal">→</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Task Popup -->
      <div v-if="isTaskPopupVisible" 
           class="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out backdrop-blur-sm"
           :class="{ 'bg-black/50 dark:bg-black/60': isTaskPopupVisible }"
           @click.self="closeTaskPopup">
        <div class="card max-w-3xl w-full mx-4 p-6 transition-all-normal animate-scale-in bg-gradient-to-b from-white/70 to-white dark:from-gray-800/70 dark:to-gray-800 shadow-xl"
             :class="popupAnimation">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white transition-colors-normal">
              {{ popupTitle }}
            </h2>
            <button @click="closeTaskPopup" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors-normal">
              <IconManager 
                name="x-close" 
                size="24" 
                title="Close dialog"
              />
            </button>
          </div>
          
          <div class="max-h-[60vh] overflow-y-auto pr-1">
            <div v-if="filteredTasks.length === 0" class="text-center py-10">
              <p class="text-gray-500 dark:text-gray-400">No tasks found</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="task in filteredTasks" :key="task.id" 
                  class="bg-gradient-to-b from-gray-50/90 to-gray-50 dark:from-gray-700/90 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-all duration-250 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ task.title }}</h3>
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
                
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ task.description }}</p>
                
                <!-- Tags -->
                <div v-if="task.tags && task.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
                  <span
                    v-for="tagId in task.tags"
                    :key="tagId"
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :style="{ backgroundColor: getTagColor(tagId) + '33', color: getTagColor(tagId) }"
                  >
                    {{ getTagName(tagId) }}
                  </span>
                </div>
                
                <!-- Date and Status -->
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
                      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300': task.status === 'todo',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300': task.status === 'inProgress',
                      'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300': task.status === 'done'
                    }"
                  >
                    {{ formatStatus(task.status) }}
                  </span>
                </div>
                
                <!-- Comments count -->
                <div v-if="task.comments && task.comments.length > 0" class="mt-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ task.comments.length }} {{ task.comments.length === 1 ? 'comment' : 'comments' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <router-link 
              to="/board" 
              class="btn btn-primary px-4 py-2 text-sm"
            >
              Go to Board
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity & Features Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity Panel -->
        <div class="card p-0 col-span-1 lg:col-span-2 transition-all-normal overflow-hidden bg-gradient-to-b from-white/70 to-white dark:from-gray-800/70 dark:to-gray-800">
          <div class="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div class="p-6">
            <div v-if="recentActivities.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="(activity, index) in recentActivities" :key="index" class="py-3">
                <div class="flex items-start">
                  <!-- Icon based on activity type -->
                  <div class="mr-3">
                    <span class="flex h-8 w-8 rounded-full items-center justify-center" 
                          :class="{
                            'bg-green-100 dark:bg-green-900/30': activity.type === 'created',
                            'bg-blue-100 dark:bg-blue-900/30': activity.type === 'status',
                            'bg-indigo-100 dark:bg-indigo-900/30': activity.type === 'comment',
                            'bg-gray-100 dark:bg-gray-700': !['created', 'status', 'comment'].includes(activity.type)
                          }">
                      <svg v-if="activity.type === 'created'" class="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                      </svg>
                      <svg v-else-if="activity.type === 'status'" class="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else-if="activity.type === 'comment'" class="h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else class="h-5 w-5 text-gray-600 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ activity.taskTitle }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ activity.message }}
                    </p>
                  </div>
                  <div class="ml-3 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTimestamp(activity.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-10">
              <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by creating or updating tasks</p>
            </div>
          </div>
        </div>
        
        <!-- New Features Panel - Post-it Note Board Style -->
        <div class="card p-0 transition-all-normal overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div class="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">New Ideas</h2>
          </div>
          <div class="p-6 bg-gray-50 dark:bg-gray-850 relative dark:bg-pattern-dark" 
               style="background-image: url('data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0z\'/%3E%3Cpath d=\'M6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E');">
            <div class="relative max-w-md mx-auto">
              <!-- Task Comments Post-it Note -->
              <div class="transform rotate-2 group hover:-rotate-1 transition-all duration-300 z-10 mb-3">
                <div class="bg-yellow-100 dark:bg-yellow-800/40 p-3 rounded shadow-md hover:shadow-lg border-t-4 border-yellow-300 dark:border-yellow-600 relative transition-all duration-300">
                  <!-- Push pin decoration -->
                  <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 shadow flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                  </div>
                  
                  <!-- Edit Mode Controls -->
                  <div class="absolute top-1 right-1 flex space-x-1">
                    <button v-if="!isEditingNote1" @click="isEditingNote1 = true" 
                      class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                      aria-label="Edit note">
                      <IconManager name="edit" size="12" />
                    </button>
                    <template v-else>
                      <button @click="isEditingNote1 = false" 
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        aria-label="Cancel editing">
                        <IconManager name="x-close" size="12" />
                      </button>
                      <button @click="saveNote1" 
                        class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        aria-label="Save changes">
                        <IconManager name="check" size="12" />
                      </button>
                    </template>
                  </div>
                  
                  <div class="flex items-start space-x-2 mt-2">
                    <div class="flex-shrink-0 bg-white dark:bg-gray-700 h-7 w-7 rounded-full p-1 shadow-inner">
                      <IconManager 
                        name="comment" 
                        size="18" 
                        className="text-indigo-600 dark:text-indigo-300" 
                        title="Task Comments"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div v-if="!isEditingNote1">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-yellow-50">{{ note1Title }}</h3>
                        <ul class="mt-1 text-xs text-gray-800 dark:text-gray-200 space-y-0.5">
                          <li v-for="(item, index) in note1Items" :key="index" class="flex items-start">
                            <span class="inline-block w-1 h-1 rounded-full bg-gray-600 dark:bg-gray-300 mt-1 mr-1.5"></span>
                            <span>{{ item }}</span>
                          </li>
                        </ul>
                      </div>
                      <div v-else class="space-y-1">
                        <input 
                          v-model="note1Title" 
                          class="w-full px-1.5 py-0.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 text-gray-900 dark:text-gray-100"
                          aria-label="Note title"
                        />
                        <div v-for="(item, index) in note1Items" :key="index" class="flex items-center space-x-1">
                          <input 
                            v-model="note1Items[index]" 
                            class="w-full px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 text-gray-900 dark:text-gray-100"
                            aria-label="Note item"
                          />
                          <button @click="removeNoteItem(1, index)" 
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                            aria-label="Remove item">
                            <IconManager name="x-close" size="10" />
                          </button>
                        </div>
                        <button @click="addNoteItem(1)" 
                          class="mt-1 text-xs flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                          aria-label="Add new item">
                          <IconManager name="plus" size="12" className="mr-1" />
                          Add item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Activity History Post-it Note -->
              <div class="transform -rotate-1.5 group hover:rotate-1 transition-all duration-300 z-20 mb-3">
                <div class="bg-blue-100 dark:bg-blue-800/40 p-3 rounded shadow-md hover:shadow-lg border-t-4 border-blue-300 dark:border-blue-600 relative transition-all duration-300">
                  <!-- Push pin decoration -->
                  <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 shadow flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                  </div>
                  
                  <!-- Edit Mode Controls -->
                  <div class="absolute top-1 right-1 flex space-x-1">
                    <button v-if="!isEditingNote2" @click="isEditingNote2 = true" 
                      class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                      aria-label="Edit note">
                      <IconManager name="edit" size="12" />
                    </button>
                    <template v-else>
                      <button @click="isEditingNote2 = false" 
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        aria-label="Cancel editing">
                        <IconManager name="x-close" size="12" />
                      </button>
                      <button @click="saveNote2" 
                        class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        aria-label="Save changes">
                        <IconManager name="check" size="12" />
                      </button>
                    </template>
                  </div>
                  
                  <div class="flex items-start space-x-2 mt-2">
                    <div class="flex-shrink-0 bg-white dark:bg-gray-700 h-7 w-7 rounded-full p-1 shadow-inner">
                      <IconManager 
                        name="history" 
                        size="18" 
                        className="text-blue-600 dark:text-blue-300" 
                        title="Activity History"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div v-if="!isEditingNote2">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-blue-50">{{ note2Title }}</h3>
                        <ul class="mt-1 text-xs text-gray-800 dark:text-gray-200 space-y-0.5">
                          <li v-for="(item, index) in note2Items" :key="index" class="flex items-start">
                            <span class="inline-block w-1 h-1 rounded-full bg-gray-600 dark:bg-gray-300 mt-1 mr-1.5"></span>
                            <span>{{ item }}</span>
                          </li>
                        </ul>
                      </div>
                      <div v-else class="space-y-1">
                        <input 
                          v-model="note2Title" 
                          class="w-full px-1.5 py-0.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 text-gray-900 dark:text-gray-100"
                          aria-label="Note title"
                        />
                        <div v-for="(item, index) in note2Items" :key="index" class="flex items-center space-x-1">
                          <input 
                            v-model="note2Items[index]" 
                            class="w-full px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 text-gray-900 dark:text-gray-100"
                            aria-label="Note item"
                          />
                          <button @click="removeNoteItem(2, index)" 
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                            aria-label="Remove item">
                            <IconManager name="x-close" size="10" />
                          </button>
                        </div>
                        <button @click="addNoteItem(2)" 
                          class="mt-1 text-xs flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                          aria-label="Add new item">
                          <IconManager name="plus" size="12" className="mr-1" />
                          Add item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Interactive Dashboard Post-it Note -->
              <div class="transform rotate-1 group hover:-rotate-0.5 transition-all duration-300 z-30 mb-3">
                <div class="bg-green-100 dark:bg-green-800/40 p-3 rounded shadow-md hover:shadow-lg border-t-4 border-green-300 dark:border-green-600 relative transition-all duration-300">
                  <!-- Push pin decoration -->
                  <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 shadow flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                  </div>
                  
                  <!-- Edit Mode Controls -->
                  <div class="absolute top-1 right-1 flex space-x-1">
                    <button v-if="!isEditingNote3" @click="isEditingNote3 = true" 
                      class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                      aria-label="Edit note">
                      <IconManager name="edit" size="12" />
                    </button>
                    <template v-else>
                      <button @click="isEditingNote3 = false" 
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        aria-label="Cancel editing">
                        <IconManager name="x-close" size="12" />
                      </button>
                      <button @click="saveNote3" 
                        class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        aria-label="Save changes">
                        <IconManager name="check" size="12" />
                      </button>
                    </template>
                  </div>
                  
                  <div class="flex items-start space-x-2 mt-2">
                    <div class="flex-shrink-0 bg-white dark:bg-gray-700 h-7 w-7 rounded-full p-1 shadow-inner">
                      <IconManager 
                        name="dashboard" 
                        size="18" 
                        className="text-green-600 dark:text-green-300" 
                        title="Interactive Dashboard"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div v-if="!isEditingNote3">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-green-50">{{ note3Title }}</h3>
                        <ul class="mt-1 text-xs text-gray-800 dark:text-gray-200 space-y-0.5">
                          <li v-for="(item, index) in note3Items" :key="index" class="flex items-start">
                            <span class="inline-block w-1 h-1 rounded-full bg-gray-600 dark:bg-gray-300 mt-1 mr-1.5"></span>
                            <span>{{ item }}</span>
                          </li>
                        </ul>
                      </div>
                      <div v-else class="space-y-1">
                        <input 
                          v-model="note3Title" 
                          class="w-full px-1.5 py-0.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 text-gray-900 dark:text-gray-100"
                          aria-label="Note title"
                        />
                        <div v-for="(item, index) in note3Items" :key="index" class="flex items-center space-x-1">
                          <input 
                            v-model="note3Items[index]" 
                            class="w-full px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 text-gray-900 dark:text-gray-100"
                            aria-label="Note item"
                          />
                          <button @click="removeNoteItem(3, index)" 
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                            aria-label="Remove item">
                            <IconManager name="x-close" size="10" />
                          </button>
                        </div>
                        <button @click="addNoteItem(3)" 
                          class="mt-1 text-xs flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                          aria-label="Add new item">
                          <IconManager name="plus" size="12" className="mr-1" />
                          Add item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6 text-center">
              <router-link to="/board" class="inline-flex items-center justify-center py-2 px-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-800/30 text-primary-600 dark:text-primary-400 font-medium rounded-md transition-colors-normal focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-850">
                <IconManager name="task-list" size="16" className="mr-2" />
                Go to Board
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Landing page for non-authenticated users -->
    <main v-else id="main-content" class="container mx-auto px-4 py-8 flex-grow">
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
        <div class="card p-6 transition-all-normal overflow-hidden bg-gradient-to-b from-white/70 to-white dark:from-gray-800/70 dark:to-gray-800 hover-lift">
          <div class="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Drag & Drop Interface</h3>
          <p class="text-gray-600 dark:text-gray-300">Easily move tasks between columns with our intuitive drag-and-drop interface.</p>
        </div>
        
        <div class="card p-6 transition-all-normal overflow-hidden bg-gradient-to-b from-white/70 to-white dark:from-gray-800/70 dark:to-gray-800 hover-lift">
          <div class="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Task Prioritization</h3>
          <p class="text-gray-600 dark:text-gray-300">Set priorities and deadlines to keep track of your most important tasks.</p>
        </div>
        
        <div class="card p-6 transition-all-normal overflow-hidden bg-gradient-to-b from-white/70 to-white dark:from-gray-800/70 dark:to-gray-800 hover-lift">
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
      <div class="rounded-lg p-8 text-center transition-all duration-250 overflow-hidden relative bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 shadow-xl hover-lift">
        <div class="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
        <div class="relative z-10">
          <h2 class="text-2xl font-bold text-white mb-4">Ready to streamline your workflow?</h2>
          <p class="text-indigo-100 mb-6 max-w-2xl mx-auto">Join thousands of users who are already enjoying the benefits of FlowBoard.</p>
          <router-link to="/register" class="inline-block bg-white text-indigo-600 font-medium py-3 px-6 rounded-md shadow-sm hover:bg-gray-100 transition-colors">
            Start Free Today
          </router-link>
        </div>
      </div>
    </main>
    
    <!-- Footer component -->
    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, onBeforeUnmount } from 'vue';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import IconManager from '../components/IconManager.vue';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';

const authStore = useAuthStore();
const taskStore = useTaskStore();

// Post-it Notes state
const isEditingNote1 = ref(false);
const isEditingNote2 = ref(false);
const isEditingNote3 = ref(false);

// Note 1 - Task Comments
const note1Title = ref('Task Comments');
const note1Items = ref([
  'Add comments to tasks',
  'Collaborate with your team',
  'Keep discussions organized'
]);

// Note 2 - Activity History
const note2Title = ref('Activity History');
const note2Items = ref([
  'Track all task changes',
  'See who did what',
  'Timestamp for all activities'
]);

// Note 3 - Interactive Dashboard
const note3Title = ref('Interactive Dashboard');
const note3Items = ref([
  'Get insights into your tasks',
  'View real-time metrics',
  'Track recent activity',
  'Visualize task distribution'
]);

// Methods for editing notes
const saveNote1 = () => {
  // Optionally save to backend or localStorage
  isEditingNote1.value = false;
};

const saveNote2 = () => {
  isEditingNote2.value = false;
};

const saveNote3 = () => {
  isEditingNote3.value = false;
};

const addNoteItem = (noteIndex) => {
  if (noteIndex === 1) {
    note1Items.value.push('New item');
  } else if (noteIndex === 2) {
    note2Items.value.push('New item');
  } else if (noteIndex === 3) {
    note3Items.value.push('New item');
  }
};

const removeNoteItem = (noteIndex, itemIndex) => {
  if (noteIndex === 1 && note1Items.value.length > 1) {
    note1Items.value.splice(itemIndex, 1);
  } else if (noteIndex === 2 && note2Items.value.length > 1) {
    note2Items.value.splice(itemIndex, 1);
  } else if (noteIndex === 3 && note3Items.value.length > 1) {
    note3Items.value.splice(itemIndex, 1);
  }
};

// Format timestamp for display
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric',
    hour12: true 
  });
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format status for display
const formatStatus = (status) => {
  switch(status) {
    case 'todo': return 'To Do';
    case 'inProgress': return 'In Progress';
    case 'done': return 'Done';
    default: return status;
  }
};

// Get tag name by id
const getTagName = (tagId) => {
  const tag = taskStore.getTagById?.(tagId);
  return tag ? tag.name : 'Tag';
};

// Get tag color by id
const getTagColor = (tagId) => {
  const tag = taskStore.getTagById?.(tagId);
  return tag ? tag.color : '#718096';
};

// High priority tasks count
const highPriorityTasks = computed(() => {
  return taskStore.tasks.filter(task => task.priority === 'high').length;
});

// Task popup states
const isTaskPopupVisible = ref(false);
const popupType = ref('all');
const popupAnimation = ref('scale-95 opacity-0');
let popupTimeout = null;

// Computed property for popup title
const popupTitle = computed(() => {
  switch(popupType.value) {
    case 'all': return 'All Tasks';
    case 'inProgress': return 'In Progress Tasks';
    case 'done': return 'Completed Tasks';
    case 'highPriority': return 'High Priority Tasks';
    default: return 'Tasks';
  }
});

// Computed property for filtered tasks based on popup type
const filteredTasks = computed(() => {
  switch(popupType.value) {
    case 'all':
      return taskStore.tasks;
    case 'inProgress':
      return taskStore.inProgressTasks;
    case 'done':
      return taskStore.doneTasks;
    case 'highPriority':
      return taskStore.tasks.filter(task => task.priority === 'high');
    default:
      return [];
  }
});

// Get recent activities across all tasks
const recentActivities = computed(() => {
  const activities = [];
  
  // Process each task's activity log and add task title
  taskStore.tasks.forEach(task => {
    if (task.activityLog && task.activityLog.length) {
      task.activityLog.forEach(activity => {
        activities.push({
          ...activity,
          taskTitle: task.title
        });
      });
    }
  });
  
  // Sort by timestamp, most recent first
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Return only the 10 most recent activities
  return activities.slice(0, 10);
});

// Show task popup with filtered content
const showTaskPopup = (type) => {
  // Clear any existing timeout
  if (popupTimeout) {
    clearTimeout(popupTimeout);
    popupTimeout = null;
  }
  
  popupType.value = type;
  isTaskPopupVisible.value = true;
  
  // Set the animation state after a tiny delay to ensure the transition happens
  setTimeout(() => {
    popupAnimation.value = 'scale-100 opacity-100';
  }, 10);
  
  // Set timeout to auto-close after 5 seconds
  popupTimeout = setTimeout(() => {
    closeTaskPopup();
  }, 5000);
};

// Close task popup with animation
const closeTaskPopup = () => {
  popupAnimation.value = 'scale-95 opacity-0';
  
  // Actually hide the popup after animation completes
  setTimeout(() => {
    isTaskPopupVisible.value = false;
    // Reset animation state for next opening
    setTimeout(() => {
      popupAnimation.value = 'scale-95 opacity-0';
    }, 10);
  }, 300);
  
  // Clear the timeout
  if (popupTimeout) {
    clearTimeout(popupTimeout);
    popupTimeout = null;
  }
};

// Load tasks when component mounts
onMounted(() => {
  if (authStore.isAuthenticated) {
    taskStore.loadTasks();
  }
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  if (popupTimeout) {
    clearTimeout(popupTimeout);
  }
});
</script> 

<style scoped>
/* Additional styles for dark mode pattern */
.dark .bg-pattern-dark {
  background-image: url('data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23FFFFFF\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0z\'/%3E%3Cpath d=\'M6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E');
}
</style> 