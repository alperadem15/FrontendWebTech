<template>
  <div id="app">
    <!-- Navbar nur anzeigen, wenn eingeloggt -->
    <NavBar v-if="isLoggedIn" />

    <!-- Aktuelle View -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { apiFetch } from './api'

const isLoggedIn = ref(false)

onMounted(async () => {
  const token = localStorage.getItem('authToken')
  if (token) {
    try {
      // Prüfe Token beim Backend
      await apiFetch('/auth/me')
      isLoggedIn.value = true
    } catch {
      // Token ungültig → Logout
      localStorage.removeItem('authToken')
      localStorage.removeItem('role')
      isLoggedIn.value = false
    }
  }
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
