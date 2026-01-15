<template>
  <div class="wrap">
    <h1>Meine Miete</h1>

    <div class="card" v-if="loading">Lade…</div>
    <div class="card err" v-else-if="error">{{ error }}</div>

    <div class="card" v-else-if="car">
      <h2>{{ car.brand }} {{ car.model }}</h2>
      <p class="owner" v-if="car.ownerFirmenname">Vermieter: {{ car.ownerFirmenname }}</p>
      <p class="price">{{ car.pricePerDay }} € / Tag</p>
      <p class="status">✅ Aktuell gemietet</p>
    </div>

    <div class="card" v-else>
      Du hast aktuell kein Auto gemietet.
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const API_BASE = 'https://webtech-in4o.onrender.com'

type Car = {
  id: number
  brand: string
  model: string
  pricePerDay: number
  rented?: boolean
  ownerFirmenname?: string | null
}

const loading = ref(true)
const error = ref('')
const car = ref<Car | null>(null)

onMounted(async () => {
  try {
    const kundeId = localStorage.getItem('userId')
    if (!kundeId) throw new Error('Keine kundeId gefunden. Bitte neu einloggen.')

    const res = await fetch(`${API_BASE}/cars/my-rental?kundeId=${kundeId}`)

    const contentType = res.headers.get('content-type') || ''
    const text = await res.text()

    if (!res.ok) {
      throw new Error(text || `HTTP ${res.status}`)
    }

    // ✅ Backend gibt 200 + null (oder JSON Objekt)
    const trimmed = (text || '').trim()
    if (!trimmed || trimmed === 'null') {
      car.value = null
      return
    }

    // Falls Content-Type nicht JSON ist, versuchen wir trotzdem zu parsen (Render kann hier variieren)
    car.value = JSON.parse(trimmed) as Car
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.wrap {
  max-width: 720px;
  margin: 5vh auto;
  padding: 0 16px;
  color: #f5f5f5;
}

.card {
  background: #121212;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 16px;
}

h1 {
  color: #e10600;
  margin-bottom: 16px;
}

h2 {
  margin: 0 0 8px;
}

.owner {
  opacity: 0.85;
  margin-bottom: 8px;
}

.price {
  color: #e10600;
  font-weight: 800;
  margin-bottom: 8px;
}

.status {
  color: #00ff88;
  font-weight: 800;
}

.err {
  color: #ff4d4d;
}
</style>
