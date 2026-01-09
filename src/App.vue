<template>
  <div class="home">
    <h1>Autovermietung STERN</h1>
    <p class="subtitle">Performance. Power. Vermietung.</p>

    <h2>Unsere Fahrzeuge</h2>

    <p v-if="loading">Lädt...</p>
    <p v-else-if="error" class="err">Fehler: {{ error }}</p>

    <div v-else class="cars-grid">
      <div class="car-card" v-for="car in cars" :key="car.id">
        <h3>{{ car.brand }} {{ car.model }}</h3>
        <p class="price">{{ car.pricePerDay }} € / Tag</p>

        <p
          class="status"
          :class="car.rented ? 'rented' : 'available'"
        >
          {{ car.rented ? '❌ Vermietet' : '✅ Verfügbar' }}
        </p>
      </div>
    </div>

    <DynamicForm title="Registrierung / Anfrage" />
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

const cars = ref<Car[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch('https://webtech-in4o.onrender.com/cars')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    cars.value = await res.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a1a1a, #0f0f0f);
  color: #f5f5f5;
  padding: 2.5rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
  text-align: center;
}

h1 {
  font-size: 2.6rem;
  color: #e10600;
  letter-spacing: 2px;
  margin-bottom: 0.3rem;
}

.subtitle {
  color: #aaa;
  margin-bottom: 3rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #fff;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.car-card {
  background: linear-gradient(145deg, #1a1a1a, #121212);
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 1.4rem;
  transition: all 0.25s ease;
}

.car-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.35);
}

.car-card h3 {
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #e10600;
}

.status {
  margin-top: 0.6rem;
  font-weight: bold;
}

.available {
  color: #00ff88;
}

.rented {
  color: #e10600;
}

.err {
  color: #ff4d4d;
  font-weight: bold;
}
</style>
