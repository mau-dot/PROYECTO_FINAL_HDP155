<script setup>
// Definimos lo que puede recibir este botón desde fuera
defineProps({
  texto: {
    type: String,
    default: '¡Presióname!'
  },
  // Colores Bootstrap soportados: primary, success, danger, warning, info
  color: {
    type: String,
    default: 'success'
  },
  // Tamaños Bootstrap soportados: sm, lg
  size: {
    type: String,
    default: 'lg'
  },
  emoji: {
    type: String,
    default: '⭐'
  }
})
</script>

<template>
  <button 
    class="btn fw-bold px-4 py-2 shadow-sm rounded-3 btn-infantil"
    :class="[`btn-${color}`, `btn-${size}`]"
  >
    <span v-if="emoji" class="me-2">{{ emoji }}</span>
    {{ texto }}
  </button>
</template>

<style scoped>
/* Un pequeño efecto 3D estilo videojuego para que los niños sientan el clic */
.btn-infantil {
  border-bottom: 4px solid rgba(0, 0, 0, 0.25);
  transition: transform 0.1s ease, border-bottom 0.1s ease;
}
.btn-infantil:active {
  transform: translateY(3px);
  border-bottom-width: 1px;
}
</style>