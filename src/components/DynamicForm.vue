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

    <p v-if="submitted" class="success-message">
      ✅ Formular wurde erfolgreich abgesendet!
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: String
})

const fields = ref([
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Ihr Name', value: '' },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'Ihre E-Mail', value: '' },
  { name: 'password', label: 'Passwort', type: 'password', placeholder: 'Ihr Passwort', value: '' }
])

const submitted = ref(false)

function handleSubmit() {
  console.log('Formular-Daten:', fields.value)
  submitted.value = true
  setTimeout(() => (submitted.value = false), 3000)
}
</script>

<style scoped>
.dynamic-form {
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: linear-gradient(145deg, #ffffff, #e6f0ff);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  color: #1e3a8a;
  margin-bottom: 1.5rem;
}

.form-field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #333;
}

input {
  width: 100%;
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #b0c4de;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #1e3a8a;
  box-shadow: 0 0 5px rgba(30, 58, 138, 0.5);
}

button {
  width: 100%;
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #2c50c4;
}

.success-message {
  margin-top: 1rem;
  text-align: center;
  color: green;
  font-weight: bold;
}
</style>
