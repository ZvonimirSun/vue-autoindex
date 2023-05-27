import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/:pathMatch(.*)*', component: () => import('./components/list.vue') },
  ],
})

const app = createApp(App)

app.use(router)

app.mount('#app')
