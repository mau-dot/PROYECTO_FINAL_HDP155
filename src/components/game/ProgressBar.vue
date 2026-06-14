<script setup>
// Recibe el porcentaje actual (un número de 0 a 100)
defineProps({
  porcentaje: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div class="w-100 my-3">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="fw-bold text-primary fs-5"> Tu Progreso</span>
      <span class="badge bg-primary fs-6">{{ porcentaje }}%</span>
    </div>
    
    <div class="progress rounded-pill shadow-sm" style="height: 25px;">
      <div 
        class="progress-bar progress-bar-striped progress-bar-animated bg-success fw-bold text-white fs-6"
        role="progressbar"
        :style="{ width: porcentaje + '%' }"
        :aria-valuenow="porcentaje"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {{ porcentaje > 15 ? '¡Vas muy bien! ' : '' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Transición suave para que la barra se vea fluida al llenarse */
.progress-bar {
  transition: width 0.5s ease-in-out;
}
</style>