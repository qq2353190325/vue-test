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
          component:()=>import('../components/HelloWorld.vue')
        }
      ]
    }, 
    
  ]
})

export default router
