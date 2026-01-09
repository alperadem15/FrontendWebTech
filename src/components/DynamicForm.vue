<template>
  <div class="dynamic-form">
    <h2>{{ title }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-field" v-for="(field, index) in fields" :key="index">
        <label :for="field.name">{{ field.label }}</label>
        <input
          :id="field.name"
          v-model="field.value"
          :type="field.type"
          :placeholder="field.placeholder"
          required
        />
      </div>

      <button type="submit">ABSENDEN</button>
    </form>

    <p v-if="submitted" class="success-message">
      ✅ Registrierung erfolgreich!
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: String
})

const fields = ref([
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Max Mustermann', value: '' },
  { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'max@mail.de', value: '' },
  { name: 'password', label: 'Passwort', type: 'password', placeholder: '••••••••', value: '' }
])

const submitted = ref(false)

function handleSubmit() {
  console.log('Formular:', fields.value)
  submitted.value = true
  setTimeout(() => (submitted.value = false), 3000)
}
</script>

<style scoped>
.dynamic-form {
  max-width: 420px;
  margin: 0 auto;
  background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #2a2a2a;
  box-shadow: 0 0 30px rgba(225, 6, 0, 0.25);
  color: #f5f5f5;
}

h2 {
  color: #e10600;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 1px;
}

label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
  background-color: #121212;
  color: #f5f5f5;
}

input:focus {
  outline: none;
  border-color: #e10600;
  box-shadow: 0 0 10px rgba(225, 6, 0, 0.6);
}

button {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #e10600, #ff1e1e);
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.25s ease;
}

button:hover {
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.7);
  transform: translateY(-2px);
}

.success-message {
  margin-top: 1rem;
  text-align: center;
  color: #00ff88;
  font-weight: bold;
}
</style>
