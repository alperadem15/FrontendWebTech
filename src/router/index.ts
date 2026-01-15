import { createRouter, createWebHistory } from 'vue-router'

import AccountSelectView from '@/views/AccountSelectView.vue'
import HomeView from '@/views/HomeView.vue'
import RegisterKundeView from '@/views/RegisterKundeView.vue'
import RegisterVermieterView from '@/views/RegisterVermieterView.vue'
import VermieterDashboardView from '@/views/VermieterDashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import VermieterUmsatzView from '@/views/VermieterUmsatzView.vue'
import KundeMieteView from '@/views/KundeMieteView.vue'

const routes = [
  { path: '/', name: 'account-select', component: AccountSelectView },
  { path: '/login/:role', name: 'login', component: LoginView, props: true },

  { path: '/home', name: 'home', component: HomeView },

  // Kunde: Meine Miete
  { path: '/kunde/miete', name: 'kunde-miete', component: KundeMieteView },

  { path: '/register/kunde', name: 'register-kunde', component: RegisterKundeView },
  { path: '/register/vermieter', name: 'register-vermieter', component: RegisterVermieterView },

  { path: '/vermieter/dashboard', name: 'vermieter-dashboard', component: VermieterDashboardView },
  { path: '/vermieter/umsatz', name: 'vermieter-umsatz', component: VermieterUmsatzView },

  // Fallback immer zuletzt
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('role')

  const authRequiredRoutes = ['home', 'vermieter-dashboard', 'vermieter-umsatz', 'kunde-miete']

  if (authRequiredRoutes.includes(to.name as string) && !token) {
    next({ name: 'account-select' })
    return
  }

  if (to.name === 'home' && role !== 'kunde') {
    next({ name: 'account-select' })
    return
  }

  if (to.name === 'kunde-miete' && role !== 'kunde') {
    next({ name: 'account-select' })
    return
  }

  if (to.name === 'vermieter-dashboard' && role !== 'vermieter') {
    next({ name: 'account-select' })
    return
  }

  if (to.name === 'vermieter-umsatz' && role !== 'vermieter') {
    next({ name: 'account-select' })
    return
  }

  next()
})

export default router
