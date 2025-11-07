<template>
  <div class="home">
    <h1>{{ headline }}</h1>
    <DynamicForm :title="formTitle" />
  </div>
</template>

<script setup>
// Composition API mit <script setup>

import DynamicForm from '@/components/DynamicForm.vue'

// reaktive Variablen (statt data())
const headline = ref('Autovermietung Stern – Willkommen!')
const formTitle = ref('Formular für Fahrzeuganfrage')
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
</style>
