<template>
  <div class="dashboard">
    <h1>Vermieter-Dashboard</h1>
    <p class="subtitle">Verwalte deine Fahrzeuge</p>

    <div v-if="!vermieterId" class="err">
      ❌ Keine Vermieter-ID gefunden. Bitte erneut einloggen.
    </div>

    <template v-else>
      <!-- Neues Auto hinzufügen -->
      <div class="new-car-form">
        <h2>Neues Auto hinzufügen</h2>

        <form @submit.prevent="addCar">
          <input v-model="newCar.brand" type="text" placeholder="Marke" required />
          <input v-model="newCar.model" type="text" placeholder="Modell" required />
          <input v-model.number="newCar.pricePerDay" type="number" min="0" step="0.01" placeholder="Preis pro Tag" required />
          <button type="submit" :disabled="adding">
            {{ adding ? 'Speichere...' : 'Auto hinzufügen' }}
          </button>
        </form>

        <p v-if="addError" class="err">{{ addError }}</p>
      </div>

      <h2>Meine Autos</h2>
      <p v-if="loading">Lädt Autos...</p>
      <p v-else-if="error" class="err">{{ error }}</p>

      <div v-else class="cars-grid">
        <div class="car-card" v-for="car in cars" :key="car.id">
          <h3>{{ car.brand }} {{ car.model }}</h3>
          <p class="price">{{ car.pricePerDay }} € / Tag</p>

          <p :class="car.rented ? 'rented' : 'available'">
            {{ car.rented ? '❌ Vermietet' : '✅ Verfügbar' }}
          </p>

          <button @click="toggleRented(car)" :disabled="busyIds.has(car.id)">
            {{ busyIds.has(car.id)
            ? 'Speichere...'
            : (car.rented ? 'Auf verfügbar setzen' : 'Als vermietet markieren')
            }}
          </button>

          <button @click="deleteCar(car.id)" class="delete-btn" :disabled="busyIds.has(car.id)">
            {{ busyIds.has(car.id) ? 'Lösche...' : 'Löschen' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type Car = {
  id: number
  brand: string
  model: string
  pricePerDay: number
  rented: boolean
}

const API_BASE = 'https://webtech-in4o.onrender.com'
const vermieterId = localStorage.getItem('vermieterId') //  wird beim Login gesetzt

const cars = ref<Car[]>([])
const loading = ref(true)
const error = ref('')

const adding = ref(false)
const addError = ref('')

const busyIds = ref<Set<number>>(new Set())

const newCar = ref({
  brand: '',
  model: '',
  pricePerDay: 0
})

async function loadCars() {
  if (!vermieterId) return

  loading.value = true
  error.value = ''

  try {
    // nur eigene Autos
    const res = await fetch(`${API_BASE}/vermieter/${vermieterId}/cars`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    cars.value = await res.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadCars)

async function addCar() {
  if (!vermieterId) return

  addError.value = ''
  adding.value = true

  try {
    // Auto wird Owner zugewiesen, weil wir über Vermieter-Endpoint gehen
    const res = await fetch(`${API_BASE}/vermieter/${vermieterId}/addCar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar.value)
    })

    if (!res.ok) throw new Error('HTTP ' + res.status)

    const added: Car = await res.json()
    cars.value.push(added)
    newCar.value = { brand: '', model: '', pricePerDay: 0 }
  } catch (e) {
    addError.value = 'Fehler beim Hinzufügen: ' + (e instanceof Error ? e.message : String(e))
  } finally {
    adding.value = false
  }
}

async function toggleRented(car: Car) {
  if (!vermieterId) return

  busyIds.value.add(car.id)
  const newValue = !car.rented

  try {
    // OwnerId-Schutz
    const res = await fetch(
      `${API_BASE}/cars/${car.id}/rented?rented=${newValue}&ownerId=${vermieterId}`,
      { method: 'PATCH' }
    )
    if (!res.ok) throw new Error('HTTP ' + res.status)

    const updated: Car = await res.json()
    const idx = cars.value.findIndex(c => c.id === car.id)
    if (idx !== -1) cars.value[idx] = updated
  } catch (e) {
    alert('Fehler beim Speichern: ' + (e instanceof Error ? e.message : String(e)))
  } finally {
    busyIds.value.delete(car.id)
  }
}

async function deleteCar(carId: number) {
  if (!vermieterId) return

  const ok = confirm('Willst du dieses Auto wirklich löschen?')
  if (!ok) return

  busyIds.value.add(carId)

  try {
    // OwnerId-Schutz
    const res = await fetch(`${API_BASE}/cars/${carId}?ownerId=${vermieterId}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)

    cars.value = cars.value.filter(c => c.id !== carId)
  } catch (e) {
    alert('Fehler beim Löschen: ' + (e instanceof Error ? e.message : String(e)))
  } finally {
    busyIds.value.delete(carId)
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a1a1a, #0f0f0f);
  color: #f5f5f5;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

h1 {
  color: #e10600;
  text-align: center;
  margin-bottom: 0.3rem;
}

.subtitle {
  color: #aaa;
  text-align: center;
  margin-bottom: 2rem;
}

.new-car-form {
  background: #121212;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid #2a2a2a;
}

.new-car-form input {
  display: block;
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.new-car-form button {
  width: 100%;
  padding: 0.7rem;
  background: linear-gradient(135deg, #e10600, #ff1e1e);
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  color: white;
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
  padding: 1rem;
  transition: all 0.25s ease;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.35);
}

.price {
  color: #e10600;
  font-weight: bold;
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
  margin-top: 0.6rem;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #e10600, #ff1e1e);
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  box-shadow: 0 0 12px rgba(225, 6, 0, 0.6);
  transform: translateY(-2px);
}

.delete-btn {
  background: #333;
  margin-left: 0.5rem;
}

.err {
  color: #ff4d4d;
  font-weight: bold;
  margin-top: 0.8rem;
  text-align: center;
}
</style>
