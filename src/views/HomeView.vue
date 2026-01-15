<template>
  <div class="home">
    <h1>{{ headline }}</h1>
    <p class="subtitle">Wähle dein Traumauto und miete es direkt!</p>

    <!-- Ladeanzeige / Fehler -->
    <p v-if="loading">Lädt Autos...</p>
    <p v-else-if="error" class="err">{{ error }}</p>

    <!-- Auto-Karten -->
    <div v-else class="cars-grid">
      <div class="car-card" v-for="car in cars" :key="car.id">
        <h3>{{ car.brand }} {{ car.model }}</h3>

        <!-- ✅ Vermieter-Firma anzeigen -->
        <p class="owner" v-if="car.ownerFirmenname">
          Vermieter: {{ car.ownerFirmenname }}
        </p>

        <p class="price">{{ car.pricePerDay }} € / Tag</p>

        <p :class="car.rented ? 'rented' : 'available'">
          {{ car.rented ? '❌ Vermietet' : '✅ Verfügbar' }}
        </p>

        <!-- Mieten Button nur, wenn verfügbar und eingeloggt -->
        <button v-if="!car.rented && isLoggedIn" @click="rentCar(car.id)">
          Auto mieten
        </button>
        <p v-else-if="!isLoggedIn" class="err">
          Bitte einloggen, um zu mieten
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Typ für Autos
type Car = {
  id: number
  brand: string
  model: string
  pricePerDay: number
  rented?: boolean
  ownerFirmenname?: string | null // ✅ neu
}

// Reaktive Variablen
const headline = ref('Kundenansicht')
const cars = ref<Car[]>([])
const loading = ref(true)
const error = ref('')
const isLoggedIn = ref(!!localStorage.getItem('authToken'))

// Autos vom Backend laden
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

// Auto mieten
async function rentCar(carId: number) {
  if (!isLoggedIn.value) {
    alert('Du musst eingeloggt sein, um ein Auto zu mieten!')
    return
  }

  try {
    const res = await fetch(`https://webtech-in4o.onrender.com/cars/rent/${carId}`, {
      method: 'POST'
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.text()
    alert(data)

    // Lokales Update der Ansicht
    const car = cars.value.find(c => c.id === carId)
    if (car) car.rented = true
  } catch (e) {
    alert('Fehler beim Mieten: ' + (e instanceof Error ? e.message : String(e)))
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a1a1a, #0f0f0f);
  color: #f5f5f5;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
  text-align: center;
}

h1 {
  font-size: 2.4rem;
  color: #e10600;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #aaa;
  margin-bottom: 2rem;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.car-card {
  background: linear-gradient(145deg, #1a1a1a, #121212);
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 1.2rem;
  transition: all 0.25s ease;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.35);
}

.car-card h3 {
  margin-bottom: 0.35rem;
}

/* ✅ optional: Vermieter-Zeile */
.owner {
  margin: 0 0 0.6rem;
  opacity: 0.85;
  font-weight: 600;
}

.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #e10600;
}

.available {
  color: #00ff88;
  font-weight: bold;
}

.rented {
  color: #e10600;
  font-weight: bold;
}

button {
  margin-top: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #e10600, #ff1e1e);
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

button:hover {
  box-shadow: 0 0 12px rgba(225, 6, 0, 0.6);
  transform: translateY(-2px);
}

.err {
  color: #ff4d4d;
  font-weight: bold;
  margin-top: 0.5rem;
}
</style>
