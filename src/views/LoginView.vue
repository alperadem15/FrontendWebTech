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
    // ✅ passend zu deinem Backend:
    // KundeController:      POST /kunde/login  -> String
    // AutovermieterController: POST /vermieter/login -> JSON { vermieterId, message }
    const url =
      role.value === 'vermieter'
        ? `${API_BASE}/vermieter/login`
        : `${API_BASE}/kunde/login`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    // Backend gibt bei Fehlern teilweise trotzdem 200 + Text zurück.
    // Wir lesen immer erst den Body:
    const contentType = res.headers.get('content-type') || ''
    const bodyText = await res.text()

    if (!res.ok) {
      throw new Error(`Login fehlgeschlagen (HTTP ${res.status})`)
    }

    // Kunde: plain text "Login erfolgreich!" oder "Email oder Passwort falsch!"
    if (role.value === 'kunde') {
      if (!bodyText.toLowerCase().includes('erfolgreich')) {
        throw new Error(bodyText || 'Email oder Passwort falsch!')
      }

      localStorage.setItem('authToken', 'ok') // simples Token (noch kein JWT)
      localStorage.setItem('role', 'kunde')
      localStorage.removeItem('vermieterId')

      window.dispatchEvent(new Event('auth-changed'))
      router.push('/home')
      return
    }

    // Vermieter: JSON { vermieterId, message }
    let data: any = null
    if (contentType.includes('application/json')) {
      data = JSON.parse(bodyText)
    } else {
      // Fallback: falls Backend doch Text liefert
      if (!bodyText.toLowerCase().includes('erfolgreich')) {
        throw new Error(bodyText || 'Email oder Passwort falsch!')
      }
      data = { vermieterId: null, message: bodyText }
    }

    if (!data?.vermieterId) {
      throw new Error(data?.message || 'Vermieter Login fehlgeschlagen (keine ID erhalten)')
    }

    localStorage.setItem('authToken', 'ok') // simples Token (noch kein JWT)
    localStorage.setItem('role', 'vermieter')
    localStorage.setItem('vermieterId', String(data.vermieterId))

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
