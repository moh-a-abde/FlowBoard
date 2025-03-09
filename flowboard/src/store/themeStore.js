import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: localStorage.getItem('darkMode') === 'true' || false
  }),
  
  actions: {
    // Initialize theme based on localStorage or system preference
    init() {
      // Check localStorage first
      const storedTheme = localStorage.getItem('darkMode');
      
      if (storedTheme !== null) {
        this.isDarkMode = storedTheme === 'true';
      } else {
        // If no stored preference, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode = prefersDark;
        localStorage.setItem('darkMode', prefersDark.toString());
      }
      
      this.applyTheme();
    },
    
    // Toggle between light and dark mode
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('darkMode', this.isDarkMode.toString());
      this.applyTheme();
    },
    
    // Apply the current theme to the document
    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}); 