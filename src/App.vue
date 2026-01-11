<template>
  <div id="app">
    <!-- Navbar nur anzeigen, wenn eingeloggt -->
    <NavBar v-if="isLoggedIn" />

    <!-- Aktuelle View -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { apiFetch } from '@/api'

const isLoggedIn = ref(false)

async function refreshAuthState() {
  const token = localStorage.getItem('authToken')

  // Kein Token -> sicher ausgeloggt
  if (!token) {
    isLoggedIn.value = false
    return
  }

  // Token vorhanden -> beim Backend prüfen
  try {
    await apiFetch('/auth/me')
    isLoggedIn.value = true
  } catch {
    // Token ungültig -> logout
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    isLoggedIn.value = false
  }
}

function onAuthChanged() {
  refreshAuthState()
}

onMounted(async () => {
  await refreshAuthState()
  window.addEventListener('auth-changed', onAuthChanged)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', onAuthChanged)
})
</script>

<style>
#app {
  font-family: 'Segoe UI', system-ui, sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a1a1a, #0f0f0f);
  color: #f5f5f5;
}
</style>
