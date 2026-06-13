<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  // Si desde el panel padre se le pasa una lección, entra en modo edición
  leccionToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['guardarLeccion'])

// Variables del formulario conectadas a los inputs mediante v-model
const titulo = ref('')
const nivel = ref('1')
const descripcion = ref('')

// Observador inteligente: Si cambia la lección a editar, rellena el formulario de inmediato
watch(() => props.leccionToEdit, (newVal) => {
  if (newVal) {
    titulo.value = newVal.titulo
    nivel.value = newVal.nivel
    descripcion.value = newVal.descripcion
  } else {
    limpiarFormulario()
  }
}, { immediate: true })

const enviarFormulario = () => {
  const datosLeccion = {
    titulo: titulo.value,
    nivel: nivel.value,
    descripcion: descripcion.value
  }
  // Enviamos los datos procesados a la vista padre para el guardado en base de datos o store
  emit('guardarLeccion', datosLeccion)
  limpiarFormulario()
}

const limpiarFormulario = () => {
  titulo.value = ''
  nivel.value = '1'
  descripcion.value = ''
}
</script>

<template>
  <div class="card shadow-sm border-0 rounded-3 my-3">
    <div class="card-header bg-dark text-white fw-bold py-3">
      📁 {{ leccionToEdit ? 'Modificar Lección Existente' : 'Registrar Nueva Lección' }}
    </div>
    
    <div class="card-body p-4 bg-light">
      <form @submit.prevent="enviarFormulario">
        
        <div class="mb-3">
          <label class="form-label fw-bold text-secondary">Título de la Lección</label>
          <input 
            v-model="titulo" 
            type="text" 
            class="form-control" 
            placeholder="Ej: Conociendo el color Rojo 🔴" 
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold text-secondary">Rango de Edad / Nivel Educativo</label>
          <select v-model="nivel" class="form-select" required>
            <option value="1">Nivel 1 (1-2 años) - Colores y Hábitos</option>
            <option value="2">Nivel 2 (3-4 años) - Abecedario y Números</option>
            <option value="3">Nivel 3 (5-6 años) - Palabras y Matemática básica</option>
            <option value="4">Nivel 4 (7-8 años) - Lectura Completa</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold text-secondary">Contenido o Dinámica</label>
          <textarea 
            v-model="descripcion" 
            class="form-control" 
            rows="3" 
            placeholder="Describe brevemente las instrucciones o las preguntas del minijuego..." 
            required
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" @click="limpiarFormulario" class="btn btn-outline-secondary px-4">
            Limpiar
          </button>
          <button type="submit" class="btn btn-dark px-4">
            {{ leccionToEdit ? 'Actualizar Cambios' : 'Guardar Lección' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>