<template>
  <div class="dynamic-form">
    <h2>{{ title }}</h2>

    <form @submit.prevent="handleSubmit">
      <div v-for="(field, index) in fields" :key="index" class="form-field">
        <label :for="field.name">{{ field.label }}</label>
        <input
          :id="field.name"
          v-model="field.value"
          :type="field.type"
          :placeholder="field.placeholder"
        />
      </div>

      <button type="submit">Absenden</button>
    </form>

    <p v-if="message" :class="{'success-message': success, 'err': !success}">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  title: { type: String, required: true }
})

const fields = ref([
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Ihr Name', value: '' },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'Ihre E-Mail', value: '' },
  { name: 'password', label: 'Passwort', type: 'password', placeholder: 'Ihr Passwort', value: '' }
])

const message = ref('')
const success = ref(false)

async function handleSubmit() {
  const payload = {
    name: fields.value.find(f => f.name === 'name')?.value,
    email: fields.value.find(f => f.name === 'email')?.value,
    password: fields.value.find(f => f.name === 'password')?.value
  }

  try {
    const res = await fetch('https://webtech-in4o.onrender.com/kunde/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    message.value = `Registrierung erfolgreich! ID: ${data.id}`
    success.value = true

    // Felder leeren
    fields.value.forEach(f => f.value = '')

  } catch (err: any) {
    message.value = 'Fehler bei Registrierung: ' + (err.message || err)
    success.value = false
  }
}
</script>

<style scoped>
/* bleibt wie bisher, ergänzt Error-Style */
.err { color: #b00020; font-weight: bold; margin-top: 1rem; }
</style>
