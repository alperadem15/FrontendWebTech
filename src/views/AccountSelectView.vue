<template>
  <div class="account-select">
    <h1>Willkommen bei Autovermietung STERN</h1>
    <p>Wähle dein Konto:</p>

    <div class="buttons">
      <!-- Kunde -->
      <button @click="goRegister('kunde')" class="btn">Konto erstellen (Kunde)</button>
      <button @click="goLogin('kunde')" class="btn">Login (Kunde)</button>

      <!-- Vermieter -->
      <button @click="goRegister('vermieter')" class="btn">Konto erstellen (Vermieter)</button>
      <button @click="goLogin('vermieter')" class="btn">Login (Vermieter)</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goRegister(type: 'kunde' | 'vermieter') {
  if (type === 'kunde') router.push('/register/kunde')
  else router.push('/register/vermieter')
}

function goLogin(type: 'kunde' | 'vermieter') {
  router.push(`/login/${type}`)
}
</script>

<style scoped>
.account-select {
  min-height: 100vh;
  width: 100vw;
  background: #000;
  color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

h1 {
  color: #e10600;
  margin-bottom: 1rem;
}

p {
  color: #aaa;
  margin-bottom: 2rem;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.buttons .btn {
  width: 320px;
  padding: 0.9rem 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #e10600, #ff1e1e);
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
}

.buttons .btn:hover {
  box-shadow: 0 0 15px rgba(225, 6, 0, 0.7);
  transform: translateY(-2px);
}

</style>
