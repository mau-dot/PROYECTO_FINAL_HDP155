<script setup>
// Props que envían los datos del minijuego
defineProps({
  datosPregunta: {
    type: Object,
    required: true
    
  }
})

// Definimos el evento para comunicarnos con la pantalla del nivel
const emit = defineEmits(['respuestaSeleccionada'])

const seleccionarOpcion = (opcion) => {
  // Le avisamos a la vista padre qué botón presionó el niño
  emit('respuestaSeleccionada', opcion)
}
</script>

<template>
  <div class="card border-0 shadow-lg rounded-4 overflow-hidden my-4 text-center">
    <div class="card-header bg-info text-white py-4">
      <h2 class="fw-bold mb-0"> {{ datosPregunta.pregunta || '¿Cuál es la respuesta correcta?' }} </h2>
    </div>

    <div class="card-body p-5 bg-light">
      <div class="row g-4 justify-content-center">
        <div 
          v-for="(opcion, index) in datosPregunta.opciones" 
          :key="index" 
          class="col-12 col-md-4"
        >
          <button 
            @click="seleccionarOpcion(opcion)"
            class="btn btn-outline-primary btn-lg w-100 py-4 fs-2 rounded-4 shadow-sm btn-juego-infantil"
          >
            {{ opcion }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos interactivos para simular un juego real */
.btn-juego-infantil {
  border-width: 3px;
  background-color: #ffffff;
  transition: all 0.2s ease;
  border-bottom-width: 6px !important; /* Efecto relieve */
}

.btn-juego-infantil:hover {
  transform: scale(1.05);
  background-color: #e6f0ff;
}

.btn-juego-infantil:active {
  transform: translateY(3px);
  border-bottom-width: 2px !important; /* Se hunde al clickear */
}
</style>