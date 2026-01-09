<template>
  <div class="home">
    <h1>{{ headline }}</h1>

    <div v-if="loading">Lädt...</div>
    <div v-else-if="error" class="err">Fehler: {{ error }}</div>
    <div v-else class="cars-grid">
      <div class="car-card" v-for="car in cars" :key="car.id">
        <h3>{{ car.brand }} {{ car.model }}</h3>
        <p>Preis: {{ car.pricePerDay }} €/Tag</p>
        <p v-if="car.rented" class="rented">❌ Vermietet</p>
        <p v-else class="available">✅ Verfügbar</p>
      </div>
    </div>

    <DynamicForm :title="formTitle" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DynamicForm from '@/components/DynamicForm.vue'

type Car = {
  id: number
  brand: string
  model: string
  pricePerDay: number
  rented?: boolean
}

const headline = ref('Autovermietung Stern – Willkommen!')
const formTitle = ref('Registrierung / Fahrzeuganfrage')

const cars = ref<Car[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch('https://webtech-in4o.onrender.com/cars')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    cars.value = data
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #1e3a8a;
  margin-bottom: 2rem;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.car-card {
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f9f9f9, #e6f0ff);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.car-card:hover {
  transform: translateY(-5px);
}

.car-card h3 {
  margin-bottom: 0.5rem;
  color: #1e3a8a;
}

.available {
  color: green;
  font-weight: bold;
}

.rented {
  color: red;
  font-weight: bold;
}

.err {
  color: #b00020;
  font-weight: bold;
}
</style>
