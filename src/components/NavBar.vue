<template>
  <nav class="navbar">
    <div class="logo" @click="goDefault">Autovermietung STERN</div>

    <div class="links">
      <button v-if="role === 'kunde'" @click="goHome">Home</button>
      <button v-if="role === 'vermieter'" @click="goDashboard">Dashboard</button>
      <button @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const role = ref<string | null>(null)

onMounted(() => {
  role.value = localStorage.getItem('role')
})

function goHome() {
  router.push('/home')
}

function goDashboard() {
  router.push('/vermieter/dashboard')
}

function goDefault() {
  role.value === 'vermieter'
    ? router.push('/vermieter/dashboard')
    : router.push('/home')
}

function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('role')
  window.dispatchEvent(new Event('auth-changed'))
  router.push('/') // App reagiert automatisch
}

</script>
