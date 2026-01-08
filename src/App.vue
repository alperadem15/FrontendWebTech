<template>
  <div class="home">
    <h1>{{ headline }}</h1>

    <h2>Autos aus dem Backend</h2>

    <p v-if="loading">Lädt...</p>
    <p v-else-if="error" class="err">Fehler: {{ error }}</p>

    <ul v-else>
      <li v-for="car in cars" :key="car.id">
        {{ car.brand }} {{ car.model }} – {{ car.pricePerDay }} €/Tag
        <span v-if="!car.rented">
          <button @click="rentCar(car.id)">Mieten</button>
        </span>
        <span v-else>✅ Vermietet</span>
      </li>
    </ul>

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
  rented: boolean
}

const headline = ref('Autovermietung Stern – Willkommen zu Ihrem nächsten Traumwagen!')
const formTitle = ref('Formular für Fahrzeuganfrage')

const cars = ref<Car[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await loadCars()
})

async function loadCars() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('https://webtech-in4o.onrender.com/cars')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = (await res.json()) as Car[]
    cars.value = data
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

async function rentCar(carId: number) {
  try {
    const res = await fetch(`https://webtech-in4o.onrender.com/kunde/rent/${carId}`, {
      method: 'POST'
    })
    const message = await res.text()
    alert(message)
    // Autos nach Miete neu laden
    await loadCars()
  } catch (err) {
    console.error('Fehler beim Mieten:', err)
    alert('Fehler beim Mieten: ' + err)
  }
}
</script>

<style scoped>
/* bleibt wie bisher */
</style>
