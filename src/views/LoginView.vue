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
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const API_BASE = 'https://webtech-in4o.onrender.com'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const role = computed(() => (route.params.role as 'kunde' | 'vermieter') || 'kunde')
const title = computed(() => (role.value === 'kunde' ? 'Kunden Login' : 'Vermieter Login'))

async function login() {
  error.value = ''
  loading.value = true

  try {
    const url =
      role.value === 'vermieter'
        ? `${API_BASE}/vermieter/login`
        : `${API_BASE}/kunde/login`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const contentType = res.headers.get('content-type') || ''
    const bodyText = await res.text()

    if (!res.ok) throw new Error(`Login fehlgeschlagen (HTTP ${res.status})`)

    // ✅ Kunde: JSON { kundeId, message }
    if (role.value === 'kunde') {
      let data: any = null
      if (contentType.includes('application/json')) {
        data = JSON.parse(bodyText)
      } else {
        // falls irgendwas schief läuft
        if (!bodyText.toLowerCase().includes('erfolgreich')) throw new Error(bodyText)
        throw new Error('Backend liefert kein JSON für Kunden-Login.')
      }

      if (!data?.kundeId) throw new Error(data?.message || 'Kunden Login fehlgeschlagen')

      localStorage.setItem('authToken', 'ok')
      localStorage.setItem('role', 'kunde')
      localStorage.setItem('userId', String(data.kundeId)) // ✅ neu (Kunde-ID)
      localStorage.removeItem('vermieterId')

      window.dispatchEvent(new Event('auth-changed'))
      router.push('/home')
      return
    }

    // ✅ Vermieter: JSON { vermieterId, message }
    let data: any = null
    if (contentType.includes('application/json')) {
      data = JSON.parse(bodyText)
    } else {
      if (!bodyText.toLowerCase().includes('erfolgreich')) throw new Error(bodyText || 'Email oder Passwort falsch!')
      data = { vermieterId: null, message: bodyText }
    }

    if (!data?.vermieterId) throw new Error(data?.message || 'Vermieter Login fehlgeschlagen (keine ID erhalten)')

    localStorage.setItem('authToken', 'ok')
    localStorage.setItem('role', 'vermieter')
    localStorage.setItem('vermieterId', String(data.vermieterId))
    localStorage.removeItem('userId') // Kunde-ID weg

    window.dispatchEvent(new Event('auth-changed'))
    router.push('/vermieter/dashboard')
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
