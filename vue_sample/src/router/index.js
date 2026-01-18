import HomeComponent from '@/components/HomeComponent.vue'
import MtranskeySample from '@/components/mtranskey/MtranskeySample.vue'
import NxKeyE2ESample from '@/components/nxkey/NxKeyE2ESample.vue'
import NxKeySample from '@/components/nxkey/NxKeySample.vue'
import TranskeySample from '@/components/transkey/TranskeySample.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeComponent',
    component: HomeComponent
  },
  {
    path: '/transkey',
    name: 'TranskeySample',
    component: TranskeySample
  },
  {
    path: '/mtranskey',
    name: 'MtranskeySample',
    component:MtranskeySample
  },
  {
    path: '/nxkey',
    name: 'NxKeySample',
    component:NxKeySample
  },
  {
    path: '/nxkey/e2e',
    name: 'NxKeyE2ESample',
    component: NxKeyE2ESample
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router