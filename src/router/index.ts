import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PoetryCategoryView from '../views/PoetryCategoryView.vue'
import PoetryDetailView from '../views/PoetryDetailView.vue'
import PoetsView from '../views/PoetsView.vue'
import PoetDetailView from '../views/PoetDetailView.vue'
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
      path: '/poetry/:id',
      name: 'poetry-detail',
      component: PoetryDetailView
    },
    {
      path: '/poets',
      name: 'poets',
      component: PoetsView
    },
    {
      path: '/poets/:id',
      name: 'poet-detail',
      component: PoetDetailView
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