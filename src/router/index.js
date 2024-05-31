import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      children:[
        {
          path:'',
          name: 'home',
          // component:()=>import('../views/VideoSlice.vue')
          component:()=>import('../views/home.vue')
        },
        {
          path:'/chunks',
          name: 'chunks',
          component:()=>import('../views/VideoSlice.vue')
          // component:()=>import('../components/useWorker.vue')
        },
        {
          path:'/chou',
          name: 'chou',
          component:()=>import('../components/HelloWorld.vue')
          // component:()=>import('../components/useWorker.vue')
        }
      ]
    }, 
    
  ]
})

export default router
