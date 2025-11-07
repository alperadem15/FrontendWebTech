<template>
  <div class="dynamic-form">
    <h2>{{ title }}</h2>

    <!-- v-for: rendert jedes Eingabefeld -->
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

    <!-- v-if: zeigt eine Bestätigung nach dem Absenden -->
    <p v-if="submitted" class="success-message">
      ✅ Formular wurde erfolgreich abgesendet!
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props (Daten, die vom Parent wie HomeView.vue übergeben werden)
defineProps({
  title: {
    type: String,
    required: true
  }
})

// Reaktive Liste von Feldern
const fields = ref([
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Ihr Name', value: '' },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'Ihre E-Mail', value: '' },
  { name: 'car', label: 'Fahrzeug', type: 'text', placeholder: 'Gewünschtes Modell', value: '' }
])

// Reaktiver Zustand für "abgeschickt"
const submitted = ref(false)

// Methode zum Absenden des Formulars
function handleSubmit() {
  console.log('Formular-Daten:', fields.value)
  submitted.value = true
  // Optional: nach 3 Sekunden wieder ausblenden
  setTimeout(() => (submitted.value = false), 10000)
}
</script>

<style scoped>
.dynamic-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.form-field {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

.success-message {
  margin-top: 1rem;
  color: green;
  font-weight: bold;
}
</style>
