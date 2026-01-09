<template>
  <div class="select-container">
    <h1>Account auswählen</h1>

    <div class="cards">
      <div class="card" @click="$emit('select', 'kunde')">
        <h2>👤 Kunde</h2>
        <p>Autos ansehen & mieten</p>
      </div>

      <div class="card" @click="$emit('select', 'vermieter')">
        <h2>🚗 Autovermieter</h2>
        <p>Autos verwalten</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-container {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a1a1a, #0f0f0f);
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cards {
  display: flex;
  gap: 2rem;
}

.card {
  background: linear-gradient(145deg, #1a1a1a, #121212);
  border: 1px solid #2a2a2a;
  border-radius: 18px;
  padding: 2rem;
  width: 220px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 0 25px rgba(225, 6, 0, 0.5);
}

h1 {
  color: #e10600;
  margin-bottom: 2rem;
}
</style>
