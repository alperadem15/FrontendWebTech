<template>
  <div class="add-car">
    <h2>Auto hinzufügen</h2>

    <form @submit.prevent="submit">
      <input v-model="brand" placeholder="Marke" required />
      <input v-model="model" placeholder="Modell" required />
      <input v-model.number="price" type="number" placeholder="€/Tag" required />

      <button>Auto anlegen</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['car-added'])

const brand = ref('')
const model = ref('')
const price = ref(0)

async function submit() {
  const payload = {
    brand: brand.value,
    model: model.value,
    pricePerDay: price.value
  }

  await fetch('https://webtech-in4o.onrender.com/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  emit('car-added')

  brand.value = ''
  model.value = ''
  price.value = 0
}
</script>

<style scoped>
.add-car {
  background: #121212;
  padding: 1.5rem;
  border-radius: 14px;
  margin-bottom: 2rem;
  border: 1px solid #2a2a2a;
}

input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  color: white;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 0.8rem;
  background: #e10600;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 8px;
}
</style>
