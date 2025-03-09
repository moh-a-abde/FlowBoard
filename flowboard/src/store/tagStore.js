import { defineStore } from 'pinia';

export const useTagStore = defineStore('tags', {
  state: () => ({
    tags: [],
    isLoading: false,
    error: null
  }),
  
  getters: {
    getAllTags: (state) => state.tags,
    
    getTagById: (state) => (id) => {
      const tag = state.tags.find(tag => tag.id === id);
      if (!tag) {
        console.warn(`Tag with id ${id} not found`);
      }
      return tag;
    }
  },
  
  actions: {
    // Load tags from localStorage
    loadTags() {
      this.isLoading = true;
      try {
        const savedTags = localStorage.getItem('tags');
        if (savedTags) {
          this.tags = JSON.parse(savedTags);
        } else {
          // Add default tags if none exist
          this.tags = [
            { id: 1, name: 'Feature', color: '#3B82F6' }, // blue
            { id: 2, name: 'Bug', color: '#EF4444' },     // red
            { id: 3, name: 'Documentation', color: '#10B981' }, // green
            { id: 4, name: 'UI/UX', color: '#8B5CF6' }    // purple
          ];
          this.saveTags();
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Save tags to localStorage
    saveTags() {
      localStorage.setItem('tags', JSON.stringify(this.tags));
    },
    
    // Add a new tag
    addTag(tag) {
      const newId = this.tags.length > 0 ? Math.max(...this.tags.map(t => t.id)) + 1 : 1;
      const newTag = { 
        ...tag, 
        id: newId,
        // Ensure the tag has a color if not provided
        color: tag.color || this.getRandomColor()
      };
      
      this.tags.push(newTag);
      this.saveTags();
      return newId;
    },
    
    // Update an existing tag
    updateTag(updatedTag) {
      const index = this.tags.findIndex(t => t.id === updatedTag.id);
      if (index !== -1) {
        this.tags[index] = { ...updatedTag };
        this.saveTags();
        return true;
      }
      return false;
    },
    
    // Delete a tag
    deleteTag(tagId) {
      this.tags = this.tags.filter(t => t.id !== tagId);
      this.saveTags();
    },
    
    // Get a random color for new tags
    getRandomColor() {
      const colors = [
        '#3B82F6', // blue
        '#EF4444', // red
        '#10B981', // green
        '#F59E0B', // amber
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#6366F1', // indigo
        '#14B8A6'  // teal
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }
}); 