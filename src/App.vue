<template>
  <div id="app">
    <NavBar v-if="isLoggedIn" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NavBar from '@/components/NavBar.vue'

const isLoggedIn = ref(false)

function refreshAuthState() {
  const token = localStorage.getItem('authToken')
  isLoggedIn.value = !!token
}

function onAuthChanged() {
  refreshAuthState()
}

onMounted(() => {
  refreshAuthState()
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
