<template>
  <div class="wrap">
    <h1>Umsatz</h1>

    <div class="card">
      <div class="total">
        <span>Gesamtumsatz</span>
        <strong>{{ formatEuro(data?.gesamtUmsatz ?? 0) }}</strong>
      </div>

      <div class="list" v-if="data">
        <div class="row" v-for="(e, idx) in data.events" :key="idx">
          <div class="car">{{ e.carName }}</div>
          <div class="meta">
            <span class="amount">+{{ formatEuro(e.amount) }}</span>
            <span class="date">{{ e.date }}</span>
          </div>
        </div>

        <div v-if="data.events.length === 0" class="empty">
          Noch keine Umsätze vorhanden.
        </div>
      </div>

      <div v-if="loading" class="info">Lade…</div>
      <div v-if="error" class="err">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const API_BASE = 'https://webtech-in4o.onrender.com' // lokal: http://localhost:8080

type UmsatzEvent = { carName: string; amount: number; date: string }
type UmsatzResponse = { gesamtUmsatz: number; events: UmsatzEvent[] }

const data = ref<UmsatzResponse | null>(null)
const loading = ref(false)
const error = ref('')

function formatEuro(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}

async function loadUmsatz() {
  error.value = ''
  loading.value = true

  try {
    const vermieterId = localStorage.getItem('vermieterId')
    if (!vermieterId) throw new Error('Keine vermieterId gefunden. Bitte neu einloggen.')

    const res = await fetch(`${API_BASE}/vermieter/${vermieterId}/umsatz`)
    const text = await res.text()

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)

    data.value = JSON.parse(text) as UmsatzResponse
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadUmsatz)
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

.total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 6px 4px 14px;
  border-bottom: 1px solid #2a2a2a;
}

.total span {
  opacity: 0.85;
}

.total strong {
  font-size: 20px;
}

.list {
  margin-top: 12px;
  max-height: 320px;
  overflow: auto;
  padding-right: 6px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 12px;
}

.row:hover {
  background: #1a1a1a;
}

.car {
  font-weight: 700;
}

.meta {
  display: flex;
  gap: 12px;
  align-items: center;
  white-space: nowrap;
}

.amount {
  color: #7CFC9A;
  font-weight: 800;
}

.date {
  opacity: 0.75;
  font-variant-numeric: tabular-nums;
}

.info {
  margin-top: 12px;
  opacity: 0.8;
}

.err {
  margin-top: 12px;
  color: #ff4d4d;
}

.empty {
  margin-top: 12px;
  opacity: 0.8;
}
</style>
