import { createRouter, createWebHistory } from 'vue-router'

// Views importieren
import AccountSelectView from '@/views/AccountSelectView.vue'
import HomeView from '@/views/HomeView.vue'
import RegisterKundeView from '@/views/RegisterKundeView.vue'
import RegisterVermieterView from '@/views/RegisterVermieterView.vue'
import VermieterDashboardView from '@/views/VermieterDashboardView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  // Startseite: Konto auswählen
  { path: '/', name: 'account-select', component: AccountSelectView },

  // Login
  { path: '/login/:role', name: 'login', component: LoginView, props: true },

  // Kunden-Startseite (Autos ansehen)
  { path: '/home', name: 'home', component: HomeView },

  // Registrierung Kunde
  { path: '/register/kunde', name: 'register-kunde', component: RegisterKundeView },

  // Registrierung Vermieter
  { path: '/register/vermieter', name: 'register-vermieter', component: RegisterVermieterView },

  // Vermieter Dashboard
  { path: '/vermieter/dashboard', name: 'vermieter-dashboard', component: VermieterDashboardView },

  // Fallback: nicht gefundene Route → Startseite
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// --------- ROUTE GUARD ---------
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('role') // 'kunde' oder 'vermieter'

  // Routen, die Login erfordern
  const authRequiredRoutes = ['home', 'vermieter-dashboard']

  if (authRequiredRoutes.includes(to.name as string) && !token) {
    // Nicht eingeloggt → Login-Seite
    next({ name: 'account-select' })
    return
  }

  // Rollenprüfung
  if (to.name === 'home' && role !== 'kunde') {
    next({ name: 'account-select' }) // Nur Kunden dürfen Home
    return
  }
  if (to.name === 'vermieter-dashboard' && role !== 'vermieter') {
    next({ name: 'account-select' }) // Nur Vermieter dürfen Dashboard
    return
  }

  next() // Alles ok → weiter
})

export default router
