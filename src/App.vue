<template>
  <div class="home">
    <h1>{{ headline }}</h1>

    <h2>Autos aus dem Backend</h2>

    <p v-if="loading">Lädt...</p>
    <p v-else-if="error" class="err">Fehler: {{ error }}</p>

    <ul v-else>
      <li v-for="car in cars" :key="car.id">
        {{ car.brand }} {{ car.model }} – {{ car.pricePerDay }} €/Tag
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
}

const headline = ref('Autovermietung Stern – Willkommen zu Ihrem nächsten Traumwagen!')
const formTitle = ref('Formular für Fahrzeuganfrage')

const cars = ref<Car[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
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
})
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.err {
  color: #b00020;
  font-weight: bold;
}
</style>
