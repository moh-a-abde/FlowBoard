import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import routes
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Board from './views/Board.vue'

// Import components
import IconManager from './components/IconManager.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { 
      path: '/board', 
      component: Board, 
      name: 'board',
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard for authenticated routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

// Create Pinia store
const pinia = createPinia()

// Create app
const app = createApp(App)

// Use plugins
app.use(router)
app.use(pinia)

// Register global components
app.component('IconManager', IconManager)

// Mount app
app.mount('#app')
