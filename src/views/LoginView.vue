<template>
  <div class="login">
    <h1>{{ title }}</h1>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="E-Mail" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit">Login</button>
    </form>

    <p v-if="error" class="err">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')

const role = route.params.role as 'kunde' | 'vermieter' || 'kunde'
const title = role === 'kunde' ? 'Kunden Login' : 'Vermieter Login'

async function login() {
  error.value = ''
  try {
    const res = await fetch(`https://webtech-in4o.onrender.com/auth/login/${role}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (!res.ok) throw new Error('Login fehlgeschlagen')
    const data = await res.json()

    // Token speichern
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('role', role)

    // Weiterleitung
    if (role === 'kunde') router.push('/home')
    else router.push('/vermieter/dashboard')
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
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

.err {
  color: #ff4d4d;
  margin-top: 1rem;
}
</style>
