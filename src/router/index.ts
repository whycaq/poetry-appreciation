import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PoetryCategoryView from '../views/PoetryCategoryView.vue'
import PoetsView from '../views/PoetsView.vue'
import QuotesView from '../views/QuotesView.vue'
import PoetryCreationView from '../views/PoetryCreationView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/poetry',
      name: 'poetry',
      component: PoetryCategoryView
    },
    {
      path: '/poets',
      name: 'poets',
      component: PoetsView
    },
    {
      path: '/quotes',
      name: 'quotes',
      component: QuotesView
    },
    {
      path: '/create',
      name: 'create',
      component: PoetryCreationView
    }
  ]
})

export default router