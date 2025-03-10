<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <main id="main-content" class="container mx-auto px-4 py-6" aria-label="Task board">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Board</h1>
          <p v-if="hasActiveFilters" class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ filteredTasks.length }} of {{ taskStore.tasks.length }} tasks
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Column visibility toggles for mobile -->
          <div class="flex md:hidden space-x-1 mr-2" role="tablist" aria-label="Column selector for mobile view">
            <BaseButton 
              @click="setVisibleColumn('todo')" 
              :className="[
                'px-2 py-1 text-xs rounded transition-colors',
                visibleColumn === 'todo' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              ]"
              variant="secondary"
              size="sm"
              aria-label="Show To Do column"
              :aria-selected="visibleColumn === 'todo'"
              role="tab"
            >
              To Do
            </BaseButton>
            <BaseButton 
              @click="setVisibleColumn('inProgress')" 
              :className="[
                'px-2 py-1 text-xs rounded transition-colors',
                visibleColumn === 'inProgress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              ]"
              variant="secondary"
              size="sm"
              aria-label="Show In Progress column"
              :aria-selected="visibleColumn === 'inProgress'"
              role="tab"
            >
              In Progress
            </BaseButton>
            <BaseButton 
              @click="setVisibleColumn('done')" 
              :className="[
                'px-2 py-1 text-xs rounded transition-colors',
                visibleColumn === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              ]"
              variant="secondary"
              size="sm"
              aria-label="Show Done column"
              :aria-selected="visibleColumn === 'done'"
              role="tab"
            >
              Done
            </BaseButton>
          </div>
          <BaseButton 
            @click="showAddTaskModal = true" 
            variant="primary"
            icon="plus"
            className="flex items-center shadow-md hover:shadow-lg bg-gradient-to-b from-primary-400/30 to-primary-500 dark:from-primary-400/20 dark:to-primary-500 hover:-translate-y-0.5"
            aria-label="Add new task"
          >
            Add Task
          </BaseButton>
        </div>
      </div>
      
      <!-- Tag filters bar -->
      <div class="mb-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <!-- Tag filter header with toggle button -->
        <div 
          class="px-4 py-3 flex items-center justify-between cursor-pointer relative group transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/90 dark:hover:shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]"
          @click="toggleTagFilterPanel"
          @keydown.enter="toggleTagFilterPanel"
          @keydown.space.prevent="toggleTagFilterPanel"
          :aria-expanded="isTagFilterPanelOpen"
          aria-controls="tag-filter-panel-content"
          tabindex="0"
          role="button"
        >
          <div class="flex items-center justify-start relative z-10">
            <div class="flex-shrink-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2.5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 class="text-xs font-medium text-black dark:text-white my-auto">Filter by tag</h3>
          </div>
          
          <!-- Active tag filters summary (visible when collapsed) -->
          <div class="flex items-center gap-2">
            <div v-if="selectedTagIds.length > 0 && !isTagFilterPanelOpen" class="flex flex-wrap gap-1 items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">Active:</span>
              <span class="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium shadow-sm">Tags ({{ selectedTagIds.length }})</span>
              <button 
                @click.stop="clearTagFilter" 
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline ml-1 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
            
            <!-- Chevron icon that rotates -->
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 text-gray-400 dark:text-gray-500 transform transition-transform duration-300" 
              :class="{ 'rotate-180': isTagFilterPanelOpen }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <!-- Tag filter panel body with transition -->
        <div 
          id="tag-filter-panel-content"
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="isTagFilterPanelOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
          :aria-hidden="!isTagFilterPanelOpen"
        >
          <div class="p-4">
            <div class="flex flex-wrap gap-2">
              <button 
                @click="clearTagFilter"
                class="group px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm transition-all duration-200 flex items-center"
                :class="{ 'ring-2 ring-indigo-500 dark:ring-indigo-400 font-medium': selectedTagIds.length === 0 }"
                aria-label="Show all tags"
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  All Tags
                </span>
              </button>
              
              <button 
                v-for="tag in tagStore.getAllTags" 
                :key="tag.id"
                @click="toggleTagFilter(tag.id)"
                class="group px-3 py-1.5 text-xs rounded-full inline-flex items-center transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden"
                :class="{
                  'font-medium': selectedTagIds.includes(tag.id)
                }"
                :style="{ 
                  backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : tag.color + '15',
                  color: selectedTagIds.includes(tag.id) ? '#fff' : tag.color,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: selectedTagIds.includes(tag.id) ? tag.color : tag.color + '30'
                }"
                :aria-pressed="selectedTagIds.includes(tag.id)"
                :aria-label="`Filter by ${tag.name} tag`"
              >
                <span class="relative z-10 flex items-center">
                  <svg 
                    v-if="selectedTagIds.includes(tag.id)" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-3.5 w-3.5 mr-1.5 text-white" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg 
                    v-else 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-3.5 w-3.5 mr-1.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    :style="{ stroke: tag.color }"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ tag.name }} 
                  <span class="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-20 rounded-full text-2xs">{{ getTagCount(tag.id) }}</span>
                </span>
                
                <!-- Hover ripple effect -->
                <span 
                  class="absolute inset-0 bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 rounded-full"
                  aria-hidden="true"
                ></span>
              </button>
              
              <!-- Manage Tags Button -->
              <button 
                @click="showTagManagement = true" 
                class="group px-3 py-1.5 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 shadow-sm transition-all duration-200 flex items-center"
                aria-label="Manage tags"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Manage Tags
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Collapsible filter panel -->
      <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
        <!-- Filter panel header with toggle button -->
        <div 
          class="px-4 py-3 flex items-center justify-between cursor-pointer relative group transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/90 dark:hover:shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]"
          @click="toggleFilterPanel"
          @keydown.enter="toggleFilterPanel"
          @keydown.space.prevent="toggleFilterPanel"
          :aria-expanded="isFilterPanelOpen"
          aria-controls="filter-panel-content"
          tabindex="0"
          role="button"
        >
          <div class="flex items-center justify-start relative z-10">
            <div class="flex-shrink-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2.5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 class="text-xs font-medium text-black dark:text-white my-auto">Filters & Search</h3>
          </div>
          
          <!-- Active filters summary (visible when collapsed) -->
          <div class="flex items-center gap-2">
            <div v-if="hasActiveFilters && !isFilterPanelOpen" class="flex flex-wrap gap-1 items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">Active:</span>
              <span v-if="searchQuery" class="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium shadow-sm">Search</span>
              <span v-if="priorityFilter" class="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium shadow-sm">Priority</span>
              <span v-if="dueDateFilter" class="text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded-full font-medium shadow-sm">Date</span>
              <span v-if="selectedTagIds.length > 0" class="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium shadow-sm">Tags ({{ selectedTagIds.length }})</span>
              <button 
                @click.stop="clearAllFilters" 
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline ml-1 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
            
            <!-- Chevron icon that rotates -->
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 text-gray-400 dark:text-gray-500 transform transition-transform duration-300" 
              :class="{ 'rotate-180': isFilterPanelOpen }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <!-- Filter panel body with transition -->
        <div 
          id="filter-panel-content"
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="isFilterPanelOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
          :aria-hidden="!isFilterPanelOpen"
        >
          <div class="p-4 lg:p-5 space-y-5">
            <div class="flex flex-col md:flex-row gap-5">
              <!-- Search input -->
              <div class="w-full md:w-1/3 group">
                <label for="taskSearch" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Search Tasks</label>
                <div class="relative">
                  <input 
                    type="text" 
                    id="taskSearch" 
                    v-model="searchQuery" 
                    placeholder="Search by title or description..."
                    class="w-full px-3 py-2.5 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:text-indigo-500 dark:focus:text-indigo-400 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Priority filter -->
              <div class="w-full md:w-1/3">
                <label for="priorityFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
                <div class="relative">
                  <select 
                    id="priorityFilter" 
                    v-model="priorityFilter" 
                    class="w-full appearance-none px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-200"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Due date filter -->
              <div class="w-full md:w-1/3">
                <label for="dueDateFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                <div class="relative">
                  <select 
                    id="dueDateFilter" 
                    v-model="dueDateFilter" 
                    class="w-full appearance-none px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-200"
                  >
                    <option value="">All Dates</option>
                    <option value="overdue">Overdue</option>
                    <option value="today">Due Today</option>
                    <option value="tomorrow">Due Tomorrow</option>
                    <option value="week">Due This Week</option>
                    <option value="month">Due This Month</option>
                    <option value="no-date">No Due Date</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Sorting and Active Filters -->
            <div class="flex flex-col md:flex-row justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <!-- Sorting options -->
              <div class="mb-3 md:mb-0">
                <label for="sortOption" class="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Sort By:</label>
                <div class="relative inline-block w-60">
                  <select 
                    id="sortOption" 
                    v-model="sortOption" 
                    class="appearance-none w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-200"
                  >
                    <option value="title">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="priority">Priority (High-Low)</option>
                    <option value="priority-asc">Priority (Low-High)</option>
                    <option value="dueDate">Due Date (Earliest)</option>
                    <option value="dueDate-desc">Due Date (Latest)</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Active filters badges -->
              <div class="flex flex-wrap gap-2 items-center">
                <span v-if="hasActiveFilters" class="text-sm text-gray-500 dark:text-gray-400">Active Filters:</span>
                <div v-if="searchQuery" class="flex items-center bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs rounded-full px-2.5 py-1.5 shadow-sm">
                  <span>Search: {{ searchQuery }}</span>
                  <BaseButton 
                    @click="searchQuery = ''" 
                    variant="secondary"
                    iconOnly
                    icon="close-circle"
                    className="ml-1.5 p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors duration-200"
                    aria-label="Clear search filter"
                  />
                </div>
                <div v-if="priorityFilter" class="flex items-center bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs rounded-full px-2.5 py-1.5 shadow-sm">
                  <span>Priority: {{ priorityFilter }}</span>
                  <BaseButton 
                    @click="priorityFilter = ''" 
                    variant="secondary"
                    iconOnly
                    icon="close-circle"
                    className="ml-1.5 p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors duration-200"
                    aria-label="Clear priority filter"
                  />
                </div>
                <div v-if="dueDateFilter" class="flex items-center bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs rounded-full px-2.5 py-1.5 shadow-sm">
                  <span>Date: {{ formatDueDateFilter(dueDateFilter) }}</span>
                  <BaseButton 
                    @click="dueDateFilter = ''" 
                    variant="secondary"
                    iconOnly
                    icon="close-circle"
                    className="ml-1.5 p-0.5 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800/40 transition-colors duration-200"
                    aria-label="Clear due date filter"
                  />
                </div>
                <div v-if="selectedTagIds.length > 0" class="flex items-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs rounded-full px-2.5 py-1.5 shadow-sm">
                  <span>{{ selectedTagIds.length }} tag{{ selectedTagIds.length > 1 ? 's' : '' }}</span>
                  <BaseButton 
                    @click="clearTagFilter" 
                    variant="secondary"
                    iconOnly
                    icon="close-circle"
                    className="ml-1.5 p-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors duration-200"
                    aria-label="Clear tag filters"
                  />
                </div>
                <BaseButton 
                  v-if="hasActiveFilters" 
                  @click="clearAllFilters" 
                  variant="secondary"
                  size="sm"
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline ml-1 transition-colors duration-200"
                >
                  Clear All
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Task board columns">
        <!-- To Do Column -->
        <div 
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          v-show="isColumnVisible('todo')"
          role="region"
          aria-label="To Do column"
        >
          <div class="bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-800/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-indigo-700 dark:text-indigo-300">To Do</h3>
              <span class="text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full">
                {{ getFilteredTasksByStatus('todo').length }}
              </span>
            </div>
          </div>
          <div 
            class="p-4 min-h-[300px]"
            @dragover.prevent
            @drop="onDrop($event, 'todo')"
            role="list"
            aria-label="To Do tasks"
          >
            <div 
              v-for="task in getFilteredTasksByStatus('todo')" 
              :key="task.id"
              class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3 shadow-sm hover:shadow transition-all duration-200 cursor-move touch-manipulation"
              draggable="true"
              @dragstart="onDragStart($event, task)"
              @touchstart="onTouchStart($event, task)"
              @touchmove="onTouchMove($event)"
              @touchend="onTouchEnd($event, 'todo')"
              role="listitem"
              :aria-label="`Task: ${task.title}. Priority: ${task.priority}`"
              tabindex="0"
              @keydown.enter="editTask(task)"
              @keydown.delete="deleteTask(task.id)"
              @keydown.space="toggleTaskStatus(task)"
            >
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ task.title }}</h4>
                <div class="flex space-x-1 ml-2">
                  <button 
                    @click="editTask(task)" 
                    class="p-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Edit task"
                  >
                    <span class="sr-only">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteTask(task.id)" 
                    class="p-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Delete task"
                  >
                    <span class="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ task.description }}</p>
              
              <!-- Date and Priority -->
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs text-gray-500 dark:text-gray-400" aria-label="Due date">{{ formatDate(task.dueDate) }}</span>
                </div>
                <span 
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300': task.priority === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300': task.priority === 'low'
                  }"
                  aria-label="Priority"
                >
                  {{ task.priority }}
                </span>
              </div>
              
              <!-- Tags - Now properly at the bottom of the card -->
              <div v-if="task.tags && task.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="tagId in task.tags"
                  :key="tagId"
                  class="px-2 py-0.5 text-xs font-medium rounded-full flex items-center shadow-sm"
                  :style="{ 
                    backgroundColor: getTagColor(tagId) + '15', 
                    color: getTagColor(tagId),
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: getTagColor(tagId) + '30'
                  }"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-3 w-3 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    :style="{ stroke: getTagColor(tagId) }"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ getTagName(tagId) }}
                </span>
              </div>
            </div>
            <div v-if="getFilteredTasksByStatus('todo').length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
              <span v-if="hasActiveFilters">
                No tasks match the current filters in this column.
                <button @click="clearAllFilters" class="text-indigo-600 dark:text-indigo-400 hover:underline">Clear filters</button>
              </span>
              <span v-else>
                No tasks yet. Add a new task or drag tasks here.
              </span>
            </div>
          </div>
        </div>
        
        <!-- In Progress Column -->
        <div 
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          v-show="isColumnVisible('inProgress')"
          role="region"
          aria-label="In Progress column"
        >
          <div class="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-blue-700 dark:text-blue-300">In Progress</h3>
              <span class="text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                {{ getFilteredTasksByStatus('inProgress').length }}
              </span>
            </div>
          </div>
          <div 
            class="p-4 min-h-[300px]"
            @dragover.prevent
            @drop="onDrop($event, 'inProgress')"
            role="list"
            aria-label="In Progress tasks"
          >
            <div 
              v-for="task in getFilteredTasksByStatus('inProgress')" 
              :key="task.id"
              class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3 shadow-sm hover:shadow transition-all duration-200 cursor-move touch-manipulation"
              draggable="true"
              @dragstart="onDragStart($event, task)"
              @touchstart="onTouchStart($event, task)"
              @touchmove="onTouchMove($event)"
              @touchend="onTouchEnd($event, 'inProgress')"
              role="listitem"
              :aria-label="`Task: ${task.title}. Priority: ${task.priority}`"
              tabindex="0"
              @keydown.enter="editTask(task)"
              @keydown.delete="deleteTask(task.id)"
              @keydown.space="toggleTaskStatus(task)"
            >
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ task.title }}</h4>
                <div class="flex space-x-1 ml-2">
                  <button 
                    @click="editTask(task)" 
                    class="p-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Edit task"
                  >
                    <span class="sr-only">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteTask(task.id)" 
                    class="p-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Delete task"
                  >
                    <span class="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ task.description }}</p>
              
              <!-- Date and Priority -->
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs text-gray-500 dark:text-gray-400" aria-label="Due date">{{ formatDate(task.dueDate) }}</span>
                </div>
                <span 
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300': task.priority === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300': task.priority === 'low'
                  }"
                  aria-label="Priority"
                >
                  {{ task.priority }}
                </span>
              </div>
              
              <!-- Tags - Now properly at the bottom of the card -->
              <div v-if="task.tags && task.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="tagId in task.tags"
                  :key="tagId"
                  class="px-2 py-0.5 text-xs font-medium rounded-full flex items-center shadow-sm"
                  :style="{ 
                    backgroundColor: getTagColor(tagId) + '15', 
                    color: getTagColor(tagId),
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: getTagColor(tagId) + '30'
                  }"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-3 w-3 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    :style="{ stroke: getTagColor(tagId) }"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ getTagName(tagId) }}
                </span>
              </div>
            </div>
            <div v-if="getFilteredTasksByStatus('inProgress').length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
              <span v-if="hasActiveFilters">
                No tasks match the current filters in this column.
                <button @click="clearAllFilters" class="text-indigo-600 dark:text-indigo-400 hover:underline">Clear filters</button>
              </span>
              <span v-else>
                No in-progress tasks. Drag tasks here to start working on them.
              </span>
            </div>
          </div>
        </div>
        
        <!-- Done Column -->
        <div 
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          v-show="isColumnVisible('done')"
          role="region"
          aria-label="Done column"
        >
          <div class="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/30 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-green-700 dark:text-green-300">Done</h3>
              <span class="text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                {{ getFilteredTasksByStatus('done').length }}
              </span>
            </div>
          </div>
          <div 
            class="p-4 min-h-[300px]"
            @dragover.prevent
            @drop="onDrop($event, 'done')"
            role="list"
            aria-label="Done tasks"
          >
            <div 
              v-for="task in getFilteredTasksByStatus('done')" 
              :key="task.id"
              class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3 shadow-sm hover:shadow transition-all duration-200 cursor-move touch-manipulation"
              draggable="true"
              @dragstart="onDragStart($event, task)"
              @touchstart="onTouchStart($event, task)"
              @touchmove="onTouchMove($event)"
              @touchend="onTouchEnd($event, 'done')"
              role="listitem"
              :aria-label="`Task: ${task.title}. Priority: ${task.priority}`"
              tabindex="0"
              @keydown.enter="editTask(task)"
              @keydown.delete="deleteTask(task.id)"
              @keydown.space="toggleTaskStatus(task)"
            >
              <div class="flex justify-between items-start">
                <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ task.title }}</h4>
                <div class="flex space-x-1 ml-2">
                  <button 
                    @click="editTask(task)" 
                    class="p-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Edit task"
                  >
                    <span class="sr-only">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteTask(task.id)" 
                    class="p-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Delete task"
                  >
                    <span class="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ task.description }}</p>
              
              <!-- Date and Priority -->
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs text-gray-500 dark:text-gray-400" aria-label="Due date">{{ formatDate(task.dueDate) }}</span>
                </div>
                <span 
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300': task.priority === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300': task.priority === 'low'
                  }"
                  aria-label="Priority"
                >
                  {{ task.priority }}
                </span>
              </div>
              
              <!-- Tags - Now properly at the bottom of the card -->
              <div v-if="task.tags && task.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="tagId in task.tags"
                  :key="tagId"
                  class="px-2 py-0.5 text-xs font-medium rounded-full flex items-center shadow-sm"
                  :style="{ 
                    backgroundColor: getTagColor(tagId) + '15', 
                    color: getTagColor(tagId),
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: getTagColor(tagId) + '30'
                  }"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-3 w-3 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    :style="{ stroke: getTagColor(tagId) }"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ getTagName(tagId) }}
                </span>
              </div>
            </div>
            <div v-if="getFilteredTasksByStatus('done').length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
              <span v-if="hasActiveFilters">
                No tasks match the current filters in this column.
                <button @click="clearAllFilters" class="text-indigo-600 dark:text-indigo-400 hover:underline">Clear filters</button>
              </span>
              <span v-else>
                No completed tasks. Drag tasks here when they're done.
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Floating Action Button for filter toggle on mobile -->
    <button 
      @click="toggleFilterPanel"
      class="md:hidden fixed right-4 bottom-4 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 text-white shadow-lg flex items-center justify-center z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-250 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-md overflow-hidden"
      aria-label="Toggle filters"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <span v-if="hasActiveFilters" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center z-20">
        {{ getActiveFilterCount() }}
      </span>
    </button>
    
    <!-- Add/Edit Task Modal -->
    <div 
      v-if="showAddTaskModal || editingTask" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      role="dialog" 
      aria-modal="true" 
      :aria-labelledby="editingTask ? 'edit-task-title' : 'add-task-title'"
    >
      <div 
        class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-250 animate-scale-in bg-gradient-to-b from-white/70 to-white dark:from-gray-800/70 dark:to-gray-800 border border-gray-100 dark:border-gray-700"
        @keydown.esc="closeTaskModal"
      >
        <h2 
          :id="editingTask ? 'edit-task-title' : 'add-task-title'" 
          class="text-xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          {{ editingTask ? 'Edit Task' : 'Add New Task' }}
        </h2>
        
        <form @submit.prevent="saveTask">
          <div class="mb-4">
            <label for="title" class="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input 
              type="text" 
              id="title" 
              v-model="taskForm.title" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              required
              aria-required="true"
            >
          </div>
          
          <div class="mb-4">
            <label for="description" class="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea 
              id="description" 
              v-model="taskForm.description" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              rows="3"
              aria-label="Task description"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label for="dueDate" class="block text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
            <input 
              type="date" 
              id="dueDate" 
              v-model="taskForm.dueDate" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
          </div>
          
          <div class="mb-4">
            <label for="priority" class="block text-gray-700 dark:text-gray-300 mb-2">Priority</label>
            <select 
              id="priority" 
              v-model="taskForm.priority" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              aria-label="Task priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 mb-2">Tags</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="tagId in taskForm.tags"
                :key="tagId"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: getTagColor(tagId) + '33', color: getTagColor(tagId) }"
              >
                {{ getTagName(tagId) }}
                <button
                  @click.prevent="removeTag(tagId)"
                  class="ml-1 focus:outline-none"
                  aria-label="Remove tag"
                >
                  <TagDeleteButton size="10" ariaLabel="Remove tag" @delete="removeTag(tagId)" />
                </button>
              </span>
            </div>
            
            <div class="flex items-center space-x-2">
              <select 
                v-model="selectedTag" 
                class="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                aria-label="Select a tag"
              >
                <option value="">Select a tag</option>
                <option 
                  v-for="tag in availableTags" 
                  :key="tag.id" 
                  :value="tag.id"
                  :disabled="taskForm.tags.includes(tag.id)"
                >
                  {{ tag.name }}
                </option>
              </select>
              <button 
                @click.prevent="addTagToTask" 
                class="px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!selectedTag"
                aria-label="Add tag to task"
              >
                Add
              </button>
            </div>
            
            <div class="mt-2">
              <button 
                @click.prevent="showTagManagement = true" 
                class="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm"
                aria-label="Manage tags"
              >
                Manage Tags
              </button>
            </div>
          </div>
          
          <!-- Comments Section - Only show in edit mode -->
          <div v-if="editingTask" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-medium text-gray-800 dark:text-gray-100">Comments</h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ taskComments.length }} comments</span>
            </div>
            
            <!-- Comment List -->
            <div class="mb-3 max-h-48 overflow-y-auto pr-1 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <div 
                v-for="comment in taskComments" 
                :key="comment.id"
                class="py-2 px-3 border-b border-gray-200 dark:border-gray-700 last:border-0 bg-gradient-to-b from-white/30 to-transparent dark:from-gray-700/30 dark:to-transparent transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/50"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-grow">
                    <div class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                      {{ comment.text }}
                    </div>
                    <div class="flex items-center mt-1">
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatTimestamp(comment.timestamp) }}
                      </span>
                      <span v-if="comment.isEdited" class="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        (edited)
                      </span>
                    </div>
                  </div>
                  <div class="flex ml-2">
                    <button 
                      @click="editComment(comment)" 
                      class="p-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      aria-label="Edit comment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteComment(comment.id)" 
                      class="p-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      aria-label="Delete comment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Empty state for comments -->
              <div v-if="taskComments.length === 0" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to add one!
              </div>
            </div>
            
            <!-- Add Comment -->
            <div v-if="!editingCommentId" class="rounded-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <textarea 
                v-model="newComment" 
                placeholder="Add a comment..." 
                class="w-full px-3 py-2 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-b from-white/70 to-white dark:from-gray-800/70 dark:to-gray-800 text-gray-800 dark:text-gray-200"
                rows="2"
                aria-label="New comment"
              ></textarea>
              <div class="flex justify-end py-2 px-3 bg-gray-50 dark:bg-gray-800/80">
                <button 
                  @click="addComment" 
                  class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!newComment.trim()"
                  aria-label="Add comment"
                >
                  Add Comment
                </button>
              </div>
            </div>
            
            <!-- Edit Comment -->
            <div v-else class="rounded-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <textarea 
                v-model="editedCommentText" 
                class="w-full px-3 py-2 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-b from-white/70 to-white dark:from-gray-800/70 dark:to-gray-800 text-gray-800 dark:text-gray-200"
                rows="2"
                aria-label="Edit comment"
              ></textarea>
              <div class="flex justify-end space-x-2 py-2 px-3 bg-gray-50 dark:bg-gray-800/80">
                <BaseButton 
                  @click="cancelEditComment" 
                  variant="secondary"
                  size="sm"
                  aria-label="Cancel edit"
                >
                  Cancel
                </BaseButton>
                <BaseButton 
                  @click="saveEditComment" 
                  variant="primary"
                  size="sm"
                  :disabled="!editedCommentText.trim()"
                  aria-label="Save comment edit"
                >
                  Save
                </BaseButton>
              </div>
            </div>
          </div>
          
          <!-- Activity Log - Only show in edit mode -->
          <div v-if="editingTask && activityLog.length > 0" class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-medium text-gray-800 dark:text-gray-100">Activity Log</h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ activityLog.length }} entries</span>
            </div>
            
            <div class="border border-gray-200 dark:border-gray-700 rounded-md max-h-32 overflow-y-auto pr-1 bg-gray-50 dark:bg-gray-800/50">
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div 
                  v-for="(entry, index) in activityLog" 
                  :key="index"
                  class="p-2 flex items-center text-xs bg-gradient-to-b from-white/30 to-transparent dark:from-gray-700/30 dark:to-transparent transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/50"
                >
                  <span class="flex-shrink-0 mr-2">
                    <svg v-if="entry.type === 'status'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="entry.type === 'created'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="entry.type === 'comment'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </span>
                  
                  <span class="text-gray-700 dark:text-gray-300">{{ entry.message }}</span>
                  
                  <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTimestamp(entry.timestamp) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              @click="closeTaskModal" 
              class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
              aria-label="Cancel task creation"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
              aria-label="Save task"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tag Management Modal -->
    <div v-if="showTagManagement" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Manage Tags
            </h3>
            <button 
              @click="showTagManagement = false" 
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div class="mb-5">
            <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
              Current Tags
            </h4>
            <ul class="space-y-2">
              <li 
                v-for="tag in tagStore.getAllTags" 
                :key="tag.id"
                class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
              >
                <div class="flex items-center">
                  <div 
                    class="w-5 h-5 rounded-full mr-3 shadow-sm flex items-center justify-center" 
                    :style="{ backgroundColor: tag.color }"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-gray-800 dark:text-gray-200 font-medium">{{ tag.name }}</span>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="editTag(tag)" 
                    class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Edit tag"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteTag(tag.id)" 
                    class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Delete tag"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
              <li v-if="tagStore.getAllTags.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400 italic">
                No tags created yet. Add your first tag below.
              </li>
            </ul>
          </div>
          
          <form @submit.prevent="saveTag" class="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="pt-1">
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                {{ editingTagId ? 'Edit Tag' : 'Add New Tag' }}
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="tagName" class="block text-gray-700 dark:text-gray-300 mb-1.5 text-sm">Tag Name</label>
                  <input 
                    type="text" 
                    id="tagName" 
                    v-model="tagForm.name" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-200"
                    placeholder="Enter tag name"
                    required
                    aria-required="true"
                  >
                </div>
                
                <div>
                  <label for="tagColor" class="block text-gray-700 dark:text-gray-300 mb-1.5 text-sm">Tag Color</label>
                  <div class="relative">
                    <input 
                      type="color" 
                      id="tagColor" 
                      v-model="tagForm.color" 
                      class="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 shadow-sm transition-all duration-200"
                    >
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span class="text-xs font-mono text-gray-500 dark:text-gray-400">{{ tagForm.color.toUpperCase() }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3 mt-5">
                <button 
                  type="button" 
                  @click="resetTagForm" 
                  class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center"
                >
                  <svg v-if="editingTagId" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  {{ editingTagId ? 'Update Tag' : 'Add Tag' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { useTagStore } from '../store/tagStore';
import Navbar from '../components/Navbar.vue';
import BaseButton from '../components/BaseButton.vue';
import TagDeleteButton from '../components/TagDeleteButton.vue';

const router = useRouter();
const taskStore = useTaskStore();
const authStore = useAuthStore();
const tagStore = useTagStore();
const showAddTaskModal = ref(false);
const editingTask = ref(null);
const draggedTask = ref(null);
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchMovingTask = ref(null);
const visibleColumn = ref('todo'); // Default visible column on mobile
const showTagManagement = ref(false);
const editingTagId = ref(null);
const selectedTag = ref('');
const selectedTagIds = ref([]);
const isFilterPanelOpen = ref(false); // Set to false to start collapsed
const isTagFilterPanelOpen = ref(false); // Set to false to start collapsed

// Comment and activity log state
const newComment = ref('');
const editingCommentId = ref(null);
const editedCommentText = ref('');

// Task form for adding or editing
const taskForm = reactive({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  status: 'todo',
  tags: []
});

// Tag form for adding or editing
const tagForm = reactive({
  name: '',
  color: '#3B82F6'
});

// New filter state variables
const searchQuery = ref('');
const priorityFilter = ref('');
const dueDateFilter = ref('');
const sortOption = ref('title');

// Initialize tasks on component mount
onMounted(() => {
  // Make sure tags are loaded before tasks
  tagStore.loadTags();
  taskStore.loadTasks();
  
  // On mobile, determine visible column based on which has the most tasks
  if (window.innerWidth < 768) {
    if (taskStore.inProgressTasks.length > taskStore.todoTasks.length && 
        taskStore.inProgressTasks.length > taskStore.doneTasks.length) {
      visibleColumn.value = 'inProgress';
    } else if (taskStore.doneTasks.length > taskStore.todoTasks.length && 
               taskStore.doneTasks.length > taskStore.inProgressTasks.length) {
      visibleColumn.value = 'done';
    }
  }
});

// Set which column is visible on mobile
const setVisibleColumn = (column) => {
  visibleColumn.value = column;
};

// Check if a column should be visible
const isColumnVisible = (column) => {
  return window.innerWidth >= 768 || visibleColumn.value === column;
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Handle drag start
const onDragStart = (event, task) => {
  draggedTask.value = task;
  event.dataTransfer.effectAllowed = 'move';
  // Add a CSS class to indicate dragging
  event.target.classList.add('opacity-50');
};

// Handle drop
const onDrop = (event, newStatus) => {
  event.preventDefault();
  
  if (draggedTask.value) {
    // Remove any drag indicators
    const draggables = document.querySelectorAll('.opacity-50');
    draggables.forEach(el => el.classList.remove('opacity-50'));
    
    // Only update if status changed
    if (draggedTask.value.status !== newStatus) {
      taskStore.moveTask(draggedTask.value.id, newStatus);
    }
    
    draggedTask.value = null;
  }
};

// Touch event handlers for mobile drag and drop
const onTouchStart = (event, task) => {
  touchStartX.value = event.touches[0].clientX;
  touchStartY.value = event.touches[0].clientY;
  touchMovingTask.value = task;
  
  // Add visual feedback
  event.target.classList.add('scale-105', 'shadow-md');
};

const onTouchMove = (event) => {
  if (!touchMovingTask.value) return;
  
  // Prevent scrolling while dragging
  event.preventDefault();
  
  // Update the element position for visual feedback
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;
  
  // You could implement a visual "ghost" drag element here if desired
};

const onTouchEnd = (event, targetStatus) => {
  if (!touchMovingTask.value) return;
  
  // Remove visual feedback
  event.target.classList.remove('scale-105', 'shadow-md');
  
  // Only move if it's a different status
  if (touchMovingTask.value.status !== targetStatus) {
    taskStore.moveTask(touchMovingTask.value.id, targetStatus);
  }
  
  // Reset touch state
  touchMovingTask.value = null;
};

// Open edit task modal
const editTask = (task) => {
  editingTask.value = task;
  Object.assign(taskForm, {
    ...task,
    tags: task.tags || []
  });
};

// Delete a task
const deleteTask = (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(taskId);
  }
};

// Close the task modal
const closeTaskModal = () => {
  showAddTaskModal.value = false;
  editingTask.value = null;
  
  // Reset the form including tags
  Object.assign(taskForm, {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    tags: []
  });
  
  selectedTag.value = '';
  
  // Reset comment-related state
  newComment.value = '';
  editingCommentId.value = null;
  editedCommentText.value = '';
};

// Save the task
const saveTask = () => {
  if (editingTask.value) {
    // Update existing task
    taskStore.updateTask({
      ...taskForm,
      id: editingTask.value.id
    });
  } else {
    // Add new task
    taskStore.addTask({
      ...taskForm
    });
  }
  
  closeTaskModal();
};

// Logout function
const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};

// Toggle task status using keyboard for accessibility
const toggleTaskStatus = (task) => {
  // Determine next status in a cycle: todo -> inProgress -> done -> todo
  let nextStatus;
  
  switch (task.status) {
    case 'todo':
      nextStatus = 'inProgress';
      break;
    case 'inProgress':
      nextStatus = 'done';
      break;
    case 'done':
      nextStatus = 'todo';
      break;
    default:
      nextStatus = 'todo';
  }
  
  taskStore.moveTask(task.id, nextStatus);
};

// Computed for available tags (excluding ones already added to task)
const availableTags = computed(() => {
  return tagStore.getAllTags;
});

// Enhanced computed for filtered tasks based on all filters
const filteredTasks = computed(() => {
  let result = taskStore.tasks;
  
  // Tag filtering
  if (selectedTagIds.value.length > 0) {
    result = result.filter(task => 
      task.tags && task.tags.some(tagId => selectedTagIds.value.includes(tagId))
    );
  }
  
  // Priority filtering
  if (priorityFilter.value) {
    result = result.filter(task => task.priority === priorityFilter.value);
  }
  
  // Due date filtering
  if (dueDateFilter.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    result = result.filter(task => {
      if (!task.dueDate && dueDateFilter.value === 'no-date') {
        return true;
      }
      
      if (!task.dueDate) {
        return false;
      }
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      switch (dueDateFilter.value) {
        case 'overdue':
          return dueDate < today;
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'tomorrow':
          return dueDate.getTime() === tomorrow.getTime();
        case 'week':
          return dueDate >= today && dueDate < nextWeek;
        case 'month':
          return dueDate >= today && dueDate < nextMonth;
        case 'no-date':
          return !task.dueDate;
        default:
          return true;
      }
    });
  }
  
  // Search query filtering
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.description && task.description.toLowerCase().includes(query))
    );
  }
  
  // Apply sorting
  return sortTasks(result);
});

// Sort tasks based on selected sort option
const sortTasks = (tasks) => {
  const sortedTasks = [...tasks];
  
  switch (sortOption.value) {
    case 'title':
      return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sortedTasks.sort((a, b) => b.title.localeCompare(a.title));
    case 'priority':
      return sortedTasks.sort((a, b) => {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return priorityValues[b.priority] - priorityValues[a.priority];
      });
    case 'priority-asc':
      return sortedTasks.sort((a, b) => {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return priorityValues[a.priority] - priorityValues[b.priority];
      });
    case 'dueDate':
      return sortedTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'dueDate-desc':
      return sortedTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
    default:
      return sortedTasks;
  }
};

// Format due date filter for display
const formatDueDateFilter = (filter) => {
  switch (filter) {
    case 'overdue': return 'Overdue';
    case 'today': return 'Due Today';
    case 'tomorrow': return 'Due Tomorrow';
    case 'week': return 'This Week';
    case 'month': return 'This Month';
    case 'no-date': return 'No Due Date';
    default: return filter;
  }
};

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || 
         priorityFilter.value !== '' || 
         dueDateFilter.value !== '' || 
         selectedTagIds.value.length > 0;
});

// Clear all filters
const clearAllFilters = () => {
  searchQuery.value = '';
  priorityFilter.value = '';
  dueDateFilter.value = '';
  selectedTagIds.value = [];
};

// Get filtered tasks by status
const getFilteredTasksByStatus = (status) => {
  return filteredTasks.value.filter(task => task.status === status);
};

// Get tag name by id
const getTagName = (tagId) => {
  const tag = tagStore.getTagById(tagId);
  return tag ? tag.name : 'Tag';
};

// Get tag color by id
const getTagColor = (tagId) => {
  const tag = tagStore.getTagById(tagId);
  return tag ? tag.color : '#718096';
};

// Add tag to task
const addTagToTask = () => {
  if (selectedTag.value && !taskForm.tags.includes(selectedTag.value)) {
    taskForm.tags.push(selectedTag.value);
    selectedTag.value = '';
  }
};

// Remove tag from task
const removeTag = (tagId) => {
  taskForm.tags = taskForm.tags.filter(id => id !== tagId);
};

// Toggle tag filter
const toggleTagFilter = (tagId) => {
  if (selectedTagIds.value.includes(tagId)) {
    selectedTagIds.value = selectedTagIds.value.filter(id => id !== tagId);
  } else {
    selectedTagIds.value.push(tagId);
  }
};

// Clear tag filter
const clearTagFilter = () => {
  selectedTagIds.value = [];
};

// Edit tag
const editTag = (tag) => {
  editingTagId.value = tag.id;
  Object.assign(tagForm, tag);
};

// Delete tag
const deleteTag = (tagId) => {
  if (confirm('Are you sure you want to delete this tag? It will be removed from all tasks.')) {
    // First, remove the tag from all tasks
    taskStore.tasks.forEach(task => {
      if (task.tags && task.tags.includes(tagId)) {
        taskStore.removeTagFromTask(task.id, tagId);
      }
    });
    
    // Then delete the tag itself
    tagStore.deleteTag(tagId);
    
    // Update selected tag IDs for filtering if needed
    if (selectedTagIds.value.includes(tagId)) {
      selectedTagIds.value = selectedTagIds.value.filter(id => id !== tagId);
    }
  }
};

// Save tag
const saveTag = () => {
  if (editingTagId.value) {
    tagStore.updateTag({
      ...tagForm,
      id: editingTagId.value
    });
  } else {
    tagStore.addTag({
      ...tagForm
    });
  }
  
  resetTagForm();
};

// Reset tag form
const resetTagForm = () => {
  editingTagId.value = null;
  Object.assign(tagForm, {
    name: '',
    color: '#3B82F6'
  });
};

// Get count of tasks with a specific tag
const getTagCount = (tagId) => {
  return taskStore.tasks.filter(task => 
    task.tags && task.tags.includes(tagId)
  ).length;
};

// Toggle tag filter panel
const toggleTagFilterPanel = () => {
  isTagFilterPanelOpen.value = !isTagFilterPanelOpen.value;
};

// Toggle filter panel
const toggleFilterPanel = () => {
  isFilterPanelOpen.value = !isFilterPanelOpen.value;
};

// Auto-expand filter panel when filters are applied
watch([searchQuery, priorityFilter, dueDateFilter, selectedTagIds], 
  ([newSearch, newPriority, newDueDate, newTagIds]) => {
    // If any filter is applied and panel is closed, open it
    if ((newSearch || newPriority || newDueDate || newTagIds.length > 0) && !isFilterPanelOpen.value) {
      isFilterPanelOpen.value = true;
    }
    
    // Auto-expand tag filter panel when tags are selected
    if (newTagIds.length > 0 && !isTagFilterPanelOpen.value) {
      isTagFilterPanelOpen.value = true;
    }
  }
);

// Get count of active filters for the FAB badge
const getActiveFilterCount = () => {
  let count = 0;
  if (searchQuery.value) count++;
  if (priorityFilter.value) count++;
  if (dueDateFilter.value) count++;
  if (selectedTagIds.value.length > 0) count++;
  return count;
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

// Computed for task comments
const taskComments = computed(() => {
  if (!editingTask.value || !editingTask.value.id) return [];
  const task = taskStore.getTaskById(editingTask.value.id);
  return task && task.comments ? task.comments : [];
});

// Computed for activity log
const activityLog = computed(() => {
  if (!editingTask.value || !editingTask.value.id) return [];
  const task = taskStore.getTaskById(editingTask.value.id);
  return task && task.activityLog ? [...task.activityLog].reverse() : [];
});

// Add a comment to the current task
const addComment = () => {
  if (newComment.value.trim() && editingTask.value) {
    taskStore.addComment(editingTask.value.id, newComment.value.trim());
    newComment.value = '';
  }
};

// Start editing a comment
const editComment = (comment) => {
  editingCommentId.value = comment.id;
  editedCommentText.value = comment.text;
};

// Cancel editing a comment
const cancelEditComment = () => {
  editingCommentId.value = null;
  editedCommentText.value = '';
};

// Save edited comment
const saveEditComment = () => {
  if (editedCommentText.value.trim() && editingTask.value && editingCommentId.value) {
    taskStore.editComment(editingTask.value.id, editingCommentId.value, editedCommentText.value.trim());
    editingCommentId.value = null;
    editedCommentText.value = '';
  }
};

// Delete a comment
const deleteComment = (commentId) => {
  if (confirm('Are you sure you want to delete this comment?') && editingTask.value) {
    taskStore.deleteComment(editingTask.value.id, commentId);
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */

/* Improve touch targets for mobile */
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Adjust this to make smaller buttons like edit/delete still accessible */
.p-1 {
  min-height: unset;
  min-width: unset;
  padding: 0.5rem;
}

/* Add soft shadows to all buttons */
button, .btn {
  box-shadow: 0 2px 4px rgba(0, 105, 255, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover, .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 105, 255, 0.15);
}

button:active, .btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 105, 255, 0.1);
}

/* Enhanced task cards */
.bg-white.dark\:bg-gray-700.border.rounded-lg {
  background-color: white;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(248, 250, 252, 0.8));
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .bg-white.dark\:bg-gray-700.border.rounded-lg {
  background-color: #374151; /* gray-700 */
  background-image: linear-gradient(to bottom, rgba(55, 65, 81, 0.7), rgba(31, 41, 55, 0.9));
  border-color: rgba(75, 85, 99, 0.4); /* gray-600 with opacity */
}

.bg-white.dark\:bg-gray-700.border.rounded-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dark .bg-white.dark\:bg-gray-700.border.rounded-lg:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* For mobile drag and drop animation */
.touch-manipulation {
  touch-action: manipulation;
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Filter panel animation improvements */
#filter-panel-content {
  will-change: max-height, opacity;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles for filter panel toggle */
[role="button"]:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Tag filter buttons */
button.rounded-full {
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

button.rounded-full:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button.rounded-full:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Column containers */
.bg-white.dark\:bg-gray-800.rounded-lg.shadow {
  background-color: white;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(249, 250, 251, 0.9));
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dark .bg-white.dark\:bg-gray-800.rounded-lg.shadow {
  background-color: #1f2937; /* gray-800 */
  background-image: linear-gradient(to bottom, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.95));
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3);
  border-color: rgba(55, 65, 81, 0.3); /* gray-700 with opacity */
}

/* Column Headers */
.bg-blue-50, .bg-yellow-50, .bg-green-50 {
  position: relative;
  overflow: hidden;
}

.bg-blue-50::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
  pointer-events: none;
}

.dark .bg-blue-900\/30::after, 
.dark .bg-yellow-900\/30::after, 
.dark .bg-green-900\/30::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent);
  pointer-events: none;
}

/* Add task modal */
.bg-white.dark\:bg-gray-800.rounded-lg.max-w-md {
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(249, 250, 251, 0.9));
}

.dark .bg-white.dark\:bg-gray-800.rounded-lg.max-w-md {
  background-image: linear-gradient(to bottom, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.95));
}

/* Media query for mobile optimization */
@media (max-width: 768px) {
  .task-card-dragging {
    opacity: 0.7;
    transform: scale(1.03);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}
</style> 