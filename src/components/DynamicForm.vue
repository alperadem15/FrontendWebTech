<!-- src/components/DynamicForm.vue -->
<template>
  <div class="dynamic-form">
    <h2>{{ title }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-field" v-for="field in fields" :key="field.name">
        <label :for="field.name">{{ field.label }}</label>
        <input
          :id="field.name"
          v-model="field.value"
          :type="field.type"
          :placeholder="field.placeholder"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'SENDE…' : 'ABSENDEN' }}
      </button>
    </form>

    <p v-if="success" class="success-message">✅ Registrierung erfolgreich!</p>
    <p v-if="error" class="error-message">❌ {{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

/**
 * PROPS
 * title: Überschrift
 * submitUrl: Backend Endpoint
 * role: 'kunde' | 'vermieter'  -> bestimmt Felder + Payload Keys
 */
const props = defineProps({
  title: { type: String, required: true },
  submitUrl: { type: String, required: true },
  role: { type: String, required: true } // 'kunde' | 'vermieter'
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const fields = ref([])

function buildFields(role) {
  if (role === 'kunde') {
    fields.value = [
      { name: 'vorname', label: 'Vorname', type: 'text', placeholder: 'Max', value: '' },
      { name: 'nachname', label: 'Nachname', type: 'text', placeholder: 'Mustermann', value: '' },
      { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'max@mail.de', value: '' },
      { name: 'password', label: 'Passwort', type: 'password', placeholder: '••••••••', value: '' }
    ]
  } else {
    fields.value = [
      { name: 'firmenname', label: 'Firmenname', type: 'text', placeholder: 'Stern Rentals GmbH', value: '' },
      { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'vermieter@mail.de', value: '' },
      { name: 'password', label: 'Passwort', type: 'password', placeholder: '••••••••', value: '' }
    ]
  }
}

// initial
buildFields(props.role)

// falls role mal wechselt
watch(
  () => props.role,
  (newRole) => buildFields(newRole)
)

async function handleSubmit() {
  loading.value = true
  success.value = false
  error.value = ''

  const payload = {}
  fields.value.forEach((f) => {
    payload[f.name] = f.value
  })

  try {
    const response = await fetch(props.submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const txt = await response.text()
      throw new Error(txt || `Registrierung fehlgeschlagen (HTTP ${response.status})`)
    }

    success.value = true
    fields.value.forEach((f) => (f.value = ''))
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unbekannter Fehler'
  } finally {
    loading.value = false
  }
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

.form-field {
  margin-bottom: 1.2rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
}

input {
  width: 100%;
  padding: 0.75rem;
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

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.7);
  transform: translateY(-2px);
}

.success-message {
  margin-top: 1rem;
  text-align: center;
  color: #00ff88;
  font-weight: bold;
}

.error-message {
  margin-top: 1rem;
  text-align: center;
  color: #ff4d4d;
  font-weight: bold;
}
</style>
