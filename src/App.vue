<template>
  <div class="home">
    <h1>{{ headline }}</h1>
    <DynamicForm :title="formTitle" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DynamicForm from '@/components/DynamicForm.vue'

const headline = ref('Autovermietung Stern – Willkommen zu Ihrem nächsten Traumwagen!')
const formTitle = ref('Formular für Fahrzeuganfrage')
</script>

<style scoped>
/* optional eigenes Styling */
</style>
