<template>
  <div class="card shadow border-0 rounded-4">
    <div class="card-header bg-dark text-white py-3">
      <h5 class="card-title mb-0 fw-bold">
        {{ leccionToEdit ? '✏️ Editando Lección' : '✨ Crear Nueva Lección' }}
      </h5>
    </div>
    
    <div class="card-body p-4">
      <div v-if="errorFormulario" class="alert alert-warning fw-bold text-center py-2 mb-3">
        {{ errorFormulario }}
      </div>

      <form @submit.prevent="enviarFormulario">
        
        <div class="mb-3">
          <label class="form-label fw-bold text-secondary">Título de la Lección</label>
          <input type="text" v-model="titulo" class="form-control" placeholder="Ej: Conociendo el color Rojo 🔴" required>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary">Rango / Nivel</label>
            <select v-model="nivel" class="form-select" required>
              <option value="1">Nivel 1 (1-2 años)</option>
              <option value="2">Nivel 2 (3-4 años)</option>
              <option value="3">Nivel 3 (5-6 años)</option>
              <option value="4">Nivel 4 (7-8 años)</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary">Tipo de Minijuego</label>
            <select v-model="tipo" class="form-select bg-light fw-bold" @change="cambiarTipoLeccion" required>
              <option value="opcion_multiple">🔘 Opción Múltiple Clásica</option>
              <option value="completar_oracion">🧩 Completar Oración (Arrastrar)</option>
              <option value="matematica">➕ Solución Matemática</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold text-secondary">Instrucciones para el niño</label>
          <textarea v-model="descripcion" class="form-control" rows="2" placeholder="Ej: Lee cuidadosamente y resuelve..."></textarea>
        </div>

        <div class="border-top pt-3 mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-primary mb-0">🧩 Ejercicios del Juego</h6>
            <button type="button" @click="agregarEjercicio" class="btn btn-sm btn-outline-primary fw-bold">
              ➕ Añadir Ejercicio
            </button>
          </div>

          <div v-for="(item, qIndex) in preguntas" :key="qIndex" class="card bg-light border-0 p-3 mb-3 rounded-3 position-relative">
            <button v-if="preguntas.length > 1" type="button" @click="eliminarEjercicio(qIndex)" class="btn btn-sm btn-link text-danger position-absolute top-0 end-0 m-2 p-0 text-decoration-none fw-bold" title="Eliminar Ejercicio">❌</button>
            <span class="badge bg-secondary w-auto max-content mb-3 align-self-start">Ejercicio #{{ qIndex + 1 }}</span>

            <div v-if="tipo === 'opcion_multiple'">
              <input type="text" v-model="item.pregunta" class="form-control form-control-sm mb-2" placeholder="Ej: ¿De qué color es la fresa?" required />
              
              <div class="mb-3 bg-white p-2 border rounded">
                <label class="small fw-bold text-muted d-block mb-1">Imagen (Opcional):</label>
                <input type="file" accept="image/*" class="form-control form-control-sm" @change="(e) => procesarImagen(e, qIndex)" />
                <div v-if="item.imagen" class="mt-2 text-center">
                  <img :src="item.imagen" class="img-thumbnail" style="max-height: 80px; object-fit: contain;">
                  <button type="button" @click="item.imagen = null" class="btn btn-sm btn-link text-danger p-0 mt-1 d-block w-100">Quitar</button>
                </div>
              </div>

              <label class="small fw-bold text-muted d-block mb-1">Opciones (Mínimo 3):</label>
              <div class="row g-2 mb-2">
                <div v-for="(opcion, oIndex) in item.opciones" :key="oIndex" class="col-md-6 col-lg-4 d-flex">
                  <div class="input-group input-group-sm">
                    <span class="input-group-text">{{ oIndex + 1 }}</span>
                    <input type="text" v-model="item.opciones[oIndex]" class="form-control" placeholder="Escribe la opción" required />
                    <button v-if="item.opciones.length > 3" type="button" class="btn btn-outline-danger px-2" @click="quitarOpcion(qIndex, oIndex)" title="Quitar Opción">X</button>
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-dashed text-primary w-100 mb-3" @click="agregarOpcion(qIndex)">+ Añadir otra opción</button>

              <label class="small fw-bold text-success d-block mb-1">Selecciona cuál de arriba es la Correcta:</label>
              <select v-model="item.respuestaCorrecta" class="form-select form-select-sm border-success" required>
                <option value="" disabled>Elige la correcta...</option>
                <option v-for="opcion in item.opciones.filter(o => o.trim() !== '')" :key="opcion" :value="opcion">{{ opcion }}</option>
              </select>
            </div>

            <div v-else-if="tipo === 'completar_oracion'">
              <label class="small fw-bold text-muted">Oración con espacio (Usa '___' para el hueco vacío)</label>
              <input type="text" v-model="item.oracion" class="form-control form-control-sm mb-3 border-primary" placeholder="Ej: El perro hace ___ para comunicarse." required />
              
              <div class="row g-2">
                <div class="col-6">
                  <label class="small fw-bold text-success">Palabra Correcta</label>
                  <input type="text" v-model="item.palabraCorrecta" class="form-control form-control-sm border-success" placeholder="Ej: guau guau" required />
                </div>
                <div class="col-6">
                  <label class="small fw-bold text-danger">Palabra Distractora (Incorrecta)</label>
                  <input type="text" v-model="item.distractor" class="form-control form-control-sm border-danger" placeholder="Ej: miau" required />
                </div>
              </div>
            </div>

            <div v-else-if="tipo === 'matematica'">
              <div class="row g-2 align-items-center">
                <div class="col-7">
                  <label class="small fw-bold text-muted">Operación (Ej: 5 + 3 = ?)</label>
                  <input type="text" v-model="item.operacion" class="form-control form-control-lg text-center fs-4 font-monospace" placeholder="5 + 3" required />
                </div>
                <div class="col-5">
                  <label class="small fw-bold text-success">Respuesta</label>
                  <input type="number" v-model="item.respuestaCorrecta" class="form-control form-control-lg text-center border-success" placeholder="8" required />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4 border-top pt-3">
          <button type="button" @click="cancelarFormulario" class="btn btn-outline-secondary px-3" :disabled="cargando">
            {{ leccionToEdit ? 'Cancelar' : 'Limpiar' }}
          </button>
          <button type="submit" class="btn btn-dark px-4 fw-bold" :disabled="cargando">
            <span v-if="cargando" class="spinner-border spinner-border-sm me-1"></span>
            {{ leccionToEdit ? 'Guardar Cambios' : 'Crear Minijuego' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  leccionToEdit: Object,
  cargando: Boolean
})

const emit = defineEmits(['guardarLeccion', 'cancelar'])

// Variables Base
const errorFormulario = ref('')
const titulo = ref('')
const nivel = ref('1')
const descripcion = ref('')
const tipo = ref('opcion_multiple')

// Plantillas según el tipo de juego
const plantillas = {
  opcion_multiple: () => ({ pregunta: '', opciones: ['', '', ''], respuestaCorrecta: '', imagen: null }),
  completar_oracion: () => ({ oracion: '', palabraCorrecta: '', distractor: '' }),
  matematica: () => ({ operacion: '', respuestaCorrecta: null })
}

const preguntas = ref([ plantillas.opcion_multiple() ])

// Cambiar de tipo resetea los ejercicios a la estructura correcta
const cambiarTipoLeccion = () => {
  preguntas.value = [ plantillas[tipo.value]() ]
}

const agregarEjercicio = () => {
  preguntas.value.push(plantillas[tipo.value]())
}

const eliminarEjercicio = (index) => {
  preguntas.value.splice(index, 1)
}

// ==== Funciones específicas para Opción Múltiple ====
const agregarOpcion = (qIndex) => {
  preguntas.value[qIndex].opciones.push('')
}

const quitarOpcion = (qIndex, oIndex) => {
  preguntas.value[qIndex].opciones.splice(oIndex, 1)
  preguntas.value[qIndex].respuestaCorrecta = '' // Resetear correcta por seguridad
}

const procesarImagen = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => { preguntas.value[index].imagen = e.target.result }
    reader.readAsDataURL(file)
  }
}

const limpiarFormulario = () => {
  errorFormulario.value = ''
  titulo.value = ''
  nivel.value = '1'
  descripcion.value = ''
  tipo.value = 'opcion_multiple'
  preguntas.value = [ plantillas.opcion_multiple() ]
}

const cancelarFormulario = () => {
  limpiarFormulario()
  emit('cancelar') 
}

// Cargar datos para Editar
watch(() => props.leccionToEdit, (newVal) => {
  errorFormulario.value = ''
  if (newVal) {
    titulo.value = newVal.titulo
    nivel.value = String(newVal.nivel)
    descripcion.value = newVal.descripcion || ''
    tipo.value = newVal.tipo || 'opcion_multiple'
    
    if (Array.isArray(newVal.contenido)) {
      preguntas.value = JSON.parse(JSON.stringify(newVal.contenido))
    } else {
      preguntas.value = [ plantillas[tipo.value]() ]
    }
  } else {
    limpiarFormulario()
  }
}, { immediate: true })

const enviarFormulario = () => {
  errorFormulario.value = ''

  // Validación rápida local para UX antes de enviarlo al Store
  if (tipo.value === 'opcion_multiple') {
    for (let p of preguntas.value) {
      const limpias = p.opciones.filter(o => o.trim() !== '')
      const unicas = new Set(limpias)
      if (unicas.size !== limpias.length) {
        errorFormulario.value = '¡Cuidado! Tienes opciones de respuesta repetidas en un ejercicio.'
        return // Bloquea el envío
      }
    }
  }

  const datosLeccion = {
    titulo: titulo.value,
    nivel: Number(nivel.value),
    descripcion: descripcion.value,
    tipo: tipo.value, // Enviamos el tipo seleccionado
    contenido: JSON.parse(JSON.stringify(preguntas.value)) 
  }

  if (props.leccionToEdit && props.leccionToEdit.id) {
    datosLeccion.id = props.leccionToEdit.id
  }

  emit('guardarLeccion', datosLeccion)
}
</script>

<style scoped>
.max-content { width: max-content; }
.btn-dashed {
  border: 2px dashed #0d6efd;
  background: rgba(13, 110, 253, 0.05);
}
.btn-dashed:hover {
  background: rgba(13, 110, 253, 0.1);
}
</style>