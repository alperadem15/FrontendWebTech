<template>
  <DynamicForm
    title="Autovermieter-Konto erstellen"
    :submitUrl="'https://webtech-in4o.onrender.com/auth/register/vermieter'"
  />
</template>

<script setup>
import DynamicForm from '@/components/DynamicForm.vue'
</script>
