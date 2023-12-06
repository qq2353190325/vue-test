import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(), //hash 模式
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // children:[
      //   {
      //     path:'',
      //     name: 'home',
      //     component:()=>import('../components/HelloWorld.vue')
      //   }
      // ]
    }, 
    
  ]
})

export default router
