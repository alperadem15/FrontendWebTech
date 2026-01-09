<template>
  <div class="dashboard">
    <h1>Vermieter-Dashboard</h1>
    <p class="subtitle">Verwalte deine Fahrzeuge</p>

    <!-- Neues Auto hinzufügen -->
    <div class="new-car-form">
      <h2>Neues Auto hinzufügen</h2>
      <form @submit.prevent="addCar">
        <input v-model="newCar.brand" type="text" placeholder="Marke" required />
        <input v-model="newCar.model" type="text" placeholder="Modell" required />
        <input v-model.number="newCar.pricePerDay" type="number" placeholder="Preis pro Tag" required />
        <button type="submit">Auto hinzufügen</button>
      </form>
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

        <!-- Aktionen -->
        <button @click="toggleRented(car)">
          {{ car.rented ? 'Auf verfügbar setzen' : 'Als vermietet markieren' }}
        </button>
        <button @click="deleteCar(car.id)" class="delete-btn">Löschen</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

// Neues Auto
const newCar = ref({
  brand: '',
  model: '',
  pricePerDay: 0
})

// Autos vom Backend holen (nur die des Vermieters, Mock)
onMounted(async () => {
  try {
    const res = await fetch('https://webtech-in4o.onrender.com/cars') // Backend anpassen für Vermieter
    if (!res.ok) throw new Error('HTTP ' + res.status)
    cars.value = await res.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})

// Neues Auto hinzufügen
async function addCar() {
  try {
    const carToAdd = { ...newCar.value }
    const res = await fetch('https://webtech-in4o.onrender.com/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carToAdd)
    })
    if (!res.ok) throw new Error('Auto konnte nicht hinzugefügt werden')
    const addedCar = await res.json()
    cars.value.push(addedCar)
    newCar.value = { brand: '', model: '', pricePerDay: 0 }
  } catch (e) {
    alert('Fehler: ' + (e instanceof Error ? e.message : String(e)))
  }
}

// Mietstatus toggeln
function toggleRented(car: Car) {
  car.rented = !car.rented
  // Optional: Backend Update mit fetch('PUT' ...) einfügen
}

// Auto löschen
function deleteCar(carId: number) {
  cars.value = cars.value.filter(c => c.id !== carId)
  // Optional: Backend Update mit fetch('DELETE' ...) einfügen
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

.car-card h3 {
  margin-bottom: 0.5rem;
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

button:hover {
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
}
</style>
