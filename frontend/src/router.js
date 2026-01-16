import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import CreateCampaign from './pages/CreateCampaign.vue'
import Campaign from './pages/Campaign.vue'
import MyCampaigns from './pages/MyCampaigns.vue'
import Campaigns from './pages/Campaigns.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/campaigns', component: Campaigns },
  { path: '/create', component: CreateCampaign },
  { path: '/campaign/:id', component: Campaign, props: true },
  { path: '/profile', component: MyCampaigns },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top:0
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: "smooth" }
    }
  }
})
