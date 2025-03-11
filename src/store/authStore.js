import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  
  actions: {
    // Initialize auth state from localStorage
    init() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        // In a real app, we would validate the token and fetch user data
        this.user = { id: 1, name: 'Demo User', email: 'demo@example.com' };
      }
    },
    
    // Login user
    async login(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful login
        const token = 'dummy-token-' + Date.now();
        localStorage.setItem('token', token);
        this.token = token;
        this.user = { id: 1, name: 'Demo User', email };
        
        return true;
      } catch (error) {
        this.error = error.message || 'Failed to login';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Register new user
    async register(name, email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful registration
        const token = 'dummy-token-' + Date.now();
        localStorage.setItem('token', token);
        this.token = token;
        this.user = { id: 1, name, email };
        
        return true;
      } catch (error) {
        this.error = error.message || 'Failed to register';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Logout user
    logout() {
      localStorage.removeItem('token');
      this.token = null;
      this.user = null;
    }
  }
}); 