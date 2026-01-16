<template>
  <nav class="navbar">
    <div class="logo" @click="goDefault">Rent.io</div>

    <div class="right" ref="menuRoot">
      <button class="hamburger" @click.stop="toggleMenu" aria-label="Menü öffnen">
        ☰
      </button>

      <div v-if="menuOpen" class="menu" @click.stop>
        <!-- Kunde -->
        <button v-if="role === 'kunde'" @click="goHome">Home</button>
        <button v-if="role === 'kunde'" @click="goMeineMiete">Meine Miete</button>

        <!-- Vermieter -->
        <button v-if="role === 'vermieter'" @click="goDashboard">Dashboard</button>
        <button v-if="role === 'vermieter'" @click="goUmsatz">Umsatz</button>

        <div class="sep"></div>

        <button class="danger" @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const role = ref<string | null>(null)
const menuOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)

function refreshRole() {
  role.value = localStorage.getItem('role')
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onDocClick(e: MouseEvent) {
  const root = menuRoot.value
  if (!root) return
  if (root.contains(e.target as Node)) return
  closeMenu()
}

onMounted(() => {
  refreshRole()
  document.addEventListener('click', onDocClick)
  window.addEventListener('auth-changed', refreshRole)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('auth-changed', refreshRole)
})

function goHome() {
  closeMenu()
  router.push('/home')
}

function goMeineMiete() {
  closeMenu()
  router.push('/kunde/miete')
}

function goDashboard() {
  closeMenu()
  router.push('/vermieter/dashboard')
}

function goUmsatz() {
  closeMenu()
  router.push('/vermieter/umsatz')
}

function goDefault() {
  closeMenu()
  if (role.value === 'vermieter') {
    router.push('/vermieter/dashboard')
  } else {
    router.push('/home')
  }
}

function logout() {
  closeMenu()
  localStorage.removeItem('authToken')
  localStorage.removeItem('role')
  localStorage.removeItem('vermieterId')
  localStorage.removeItem('userId')

  window.dispatchEvent(new Event('auth-changed'))
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.9rem 1.2rem;
  background: #0b0b0b;
  border-bottom: 1px solid #242424;
}

.logo {
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  color: #e10600;
}

.right {
  position: relative;
}

.hamburger {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  background: #121212;
  color: #f5f5f5;
  font-size: 22px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.hamburger:hover {
  transform: translateY(-1px);
}

.menu {
  position: absolute;
  right: 0;
  top: 54px;
  min-width: 200px;
  padding: 0.5rem;
  background: #121212;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.menu button {
  width: 100%;
  text-align: left;
  padding: 0.75rem 0.85rem;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #f5f5f5;
  cursor: pointer;
  font-weight: 600;
}

.menu button:hover {
  background: #1a1a1a;
}

.sep {
  height: 1px;
  margin: 0.5rem 0;
  background: #2a2a2a;
}

.danger {
  color: #ff4d4d;
}
</style>
