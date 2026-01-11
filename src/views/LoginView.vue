<template>
  <div class="login">
    <h1>{{ title }}</h1>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Login...' : 'Login' }}
      </button>
    </form>

    <p v-if="error" class="err">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const API_BASE = 'https://webtech-in4o.onrender.com'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const role = (route.params.role as 'kunde' | 'vermieter') || 'kunde'
const title = role === 'kunde' ? 'Kunden Login' : 'Vermieter Login'

async function login() {
  error.value = ''
  loading.value = true

  try {
    const url =
      role === 'vermieter'
        ? `${API_BASE}/vermieter/login`
        : `${API_BASE}/auth/login/kunde` // falls dein Kunde-Login unter /auth läuft

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (!res.ok) throw new Error('Login fehlgeschlagen (HTTP ' + res.status + ')')

    const data = await res.json()

    // ✅ Minimal: wir setzen authToken einfach auf "ok" (weil dein Backend noch kein echtes JWT liefert)
    // Damit Route-Guard + App.vue funktionieren.
    localStorage.setItem('authToken', 'ok')
    localStorage.setItem('role', role)

    // ✅ Vermieter-ID speichern (nur wenn Vermieter)
    if (role === 'vermieter') {
      // aus deinem AutovermieterController: { vermieterId, message }
      localStorage.setItem('vermieterId', String(data.vermieterId))
    } else {
      localStorage.removeItem('vermieterId')
    }

    window.dispatchEvent(new Event('auth-changed'))

    // Weiterleitung
    if (role === 'kunde') router.push('/home')
    else router.push('/vermieter/dashboard')
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 8vh auto;
  padding: 2rem;
  background: #121212;
  border-radius: 12px;
  color: #f5f5f5;
  text-align: center;
}

input {
  display: block;
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
  background: #1a1a1a;
  color: #f5f5f5;
}

button {
  width: 100%;
  padding: 0.7rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #e10600, #ff1e1e);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.err {
  color: #ff4d4d;
  margin-top: 1rem;
}
</style>
