<script setup>
defineProps({
  idModal: {
    type: String,
    default: 'modalMedalla'
  },
  nombreInsignia: {
    type: String,
    default: '¡Campeón de los Colores!'
  },
  rutaImagen: {
    type: String,
    default: 'https://placehold.co/150x150?text=🏆' // URL temporal mientras agregamos assets
  }
})
</script>

<template>
  <div class="modal fade" :id="idModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center border-0 rounded-4 shadow">
        <div class="modal-body p-5 bg-light rounded-4">
          <h2 class="fw-bold text-primary mb-3">🎉 ¡Felicidades! 🎉</h2>
          <p class="fs-5 text-muted mb-4">¡Has ganado una medalla!</p>
          
          <div class="my-4">
            <img :src="rutaImagen" :alt="nombreInsignia" class="img-fluid badge-animada" style="max-width: 140px;">
          </div>
          
          <h3 class="text-warning fw-bold mb-4">{{ nombreInsignia }}</h3>
          
          <button type="button" class="btn btn-primary btn-lg rounded-pill px-5 fw-bold" data-bs-dismiss="modal">
            ¡Súper! 🚀
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animación de rebote infantil para la medalla */
.badge-animada {
  animation: bounce 2s infinite ease-in-out;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}
</style>