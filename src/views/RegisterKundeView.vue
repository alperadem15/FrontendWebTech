<template>
  <DynamicForm
    title="Kundenkonto erstellen"
    :submitUrl="'https://webtech-in4o.onrender.com/auth/register/kunde'"
  />
</template>

<script setup>
import DynamicForm from '@/components/DynamicForm.vue'
</script>
