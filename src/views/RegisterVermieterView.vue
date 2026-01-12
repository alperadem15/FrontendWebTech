<!-- src/views/RegisterVermieterView.vue -->
<template>
  <DynamicForm
    title="Autovermieter-Konto erstellen"
    role="vermieter"
    :submitUrl="'https://webtech-in4o.onrender.com/vermieter/register'"
  />
</template>

<script setup>
import DynamicForm from '@/components/DynamicForm.vue'
</script>
