import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './components/Dashboard/DashboardMetrics.vue'
import ProductionTracking from './components/ProductionTracking/ProductionRecords.vue'
import QualityControl from './components/QualityControl/QualityControlInspections.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  {
    path: '/production-tracking',
    name: 'ProductionTracking',
    component: ProductionTracking,
  },
  {
    path: '/quality-control',
    name: 'QualityControl',
    component: QualityControl,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
