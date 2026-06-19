<template>
  <div class="container py-4" style="max-width: 720px;">

    <button class="btn btn-outline-secondary btn-sm mb-4 fw-bold" @click="$router.go(-1)">
      ← Volver
    </button>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-warning"></div>
      <p class="mt-2 text-muted">Cargando lección...</p>
    </div>

    <div v-else-if="!leccion" class="alert alert-danger text-center fw-bold">
      No se encontró esta lección.
    </div>

    <template v-else>
      <div class="text-center mb-4 p-4 rounded-4 bg-light border">
        <span class="badge bg-warning text-dark mb-2">Matemática</span>
        <h2 class="fw-bold text-warning">{{ leccion.titulo }}</h2>
        <p class="text-muted mb-0">{{ leccion.descripcion }}</p>
      </div>

      <!-- Progress Bar -->
      <ProgressBar :porcentaje="porcentaje" />

      <!-- Problema -->
      <div v-if="!juegoTerminado" class="card border-0 shadow-sm rounded-4 p-4 mb-3 text-center">

        <div class="operacion-display mb-4">
          {{ ejercicioActual.operacion }} = ?
        </div>

        <div class="d-flex justify-content-center align-items-center gap-3 mb-3">
          <input
            v-model.number="respuestaUsuario"
            type="number"
            class="form-control text-center fw-bold fs-4"
            style="max-width: 140px; border-radius: 12px;"
            placeholder="?"
            :disabled="respondida"
            @keyup.enter="verificar"
          />
          <button
            v-if="!respondida"
            class="btn btn-warning fw-bold px-4 py-2 rounded-3"
            @click="verificar"
          >
            Comprobar ✓
          </button>
        </div>

        <div v-if="respondida" class="mt-2">
          <p v-if="respuestaCorrecta" class="text-success fw-bold fs-5">¡Correcto! 🎉</p>
          <p v-else class="text-danger fw-bold fs-5">
            Casi... La respuesta era: <strong>{{ ejercicioActual.respuestaCorrecta }}</strong> 😊
          </p>
          <button class="btn btn-warning fw-bold px-4 mt-1" @click="siguiente">
            {{ esUltimo ? 'Ver resultados 🏆' : 'Siguiente →' }}
          </button>
        </div>
      </div>

      <!-- Pantalla final -->
      <div v-else class="card border-0 shadow-sm rounded-4 p-5 text-center">
        <div class="fs-1 mb-2">🏆</div>
        <h3 class="fw-bold text-success">¡Lección completada!</h3>
        <p class="text-muted">
          Resolviste bien <strong>{{ aciertos }}</strong> de
          <strong>{{ leccion.contenido.length }}</strong> problemas.
        </p>
        <!-- ✅ Mensaje según si fue perfecta o no -->
        <p v-if="errores === 0" class="text-success fw-bold">
          ¡Sin errores! 🌟 La siguiente lección está desbloqueada.
        </p>
        <p v-else class="text-warning fw-bold">
          Tuviste {{ errores }} error(es). ¡Inténtalo de nuevo para desbloquear la siguiente!
        </p>
        <div class="d-flex gap-3 justify-content-center mt-3">
          <button class="btn btn-outline-secondary fw-bold" @click="reiniciar">Intentar de nuevo</button>
          <button class="btn btn-warning fw-bold" @click="$router.go(-1)">Volver al nivel</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLeccionesStore } from '@/stores/leccionesStore'
import ProgressBar from '@/components/game/ProgressBar.vue'

const route = useRoute()
const leccionesStore = useLeccionesStore()

const cargando = ref(true)
const leccion = ref(null)
const juegoTerminado = ref(false)
const preguntaActualIndex = ref(0)
const respuestaUsuario = ref(null)
const respondida = ref(false)
const respuestaCorrecta = ref(false)
const aciertos = ref(0)
const errores = ref(0)

const ejercicioActual = computed(() => leccion.value?.contenido[preguntaActualIndex.value])

const esUltimo = computed(() => {
  // Aseguramos que haya contenido, si no hay, asumimos que es 0
  const totalPreguntas = leccion.value?.contenido?.length || 0
  // Evitamos resultados negativos
  return totalPreguntas > 0 ? preguntaActualIndex.value === (totalPreguntas - 1) : true
})

const porcentaje = computed(() => {
  if (!leccion.value) return 0
  if (juegoTerminado.value) return 100
  
  const totalPreguntas = leccion.value?.contenido?.length || 1 // Usamos || 1 para evitar dividir entre cero
  return Math.round(((preguntaActualIndex.value + 1) / totalPreguntas) * 100)
})

onMounted(async () => {
  cargando.value = true
  const id = Number(route.params.id)
  leccion.value = await leccionesStore.obtenerLeccionPorId(id)
  cargando.value = false
})

const verificar = () => {
  if (respuestaUsuario.value === null || respuestaUsuario.value === '') return
  respuestaCorrecta.value = Number(respuestaUsuario.value) === Number(ejercicioActual.value.respuestaCorrecta)
  if (respuestaCorrecta.value) {
    aciertos.value++
  } else {
    errores.value++
  }
  respondida.value = true
}

const siguiente = async () => {
  if (esUltimo.value) {
    juegoTerminado.value = true
    // ✅ guardarProgreso ahora existe en el store
    await leccionesStore.guardarProgreso(leccion.value, aciertos.value, errores.value)
    return
  }
  preguntaActualIndex.value++
  respuestaUsuario.value = null
  respondida.value = false
  respuestaCorrecta.value = false
}

const reiniciar = () => {
  preguntaActualIndex.value = 0
  respuestaUsuario.value = null
  respondida.value = false
  respuestaCorrecta.value = false
  aciertos.value = 0
  errores.value = 0
  juegoTerminado.value = false
}
</script>

<style scoped>
.operacion-display {
  font-size: 3rem;
  font-weight: 800;
  color: #854F0B;
  letter-spacing: 4px;
  font-family: monospace;
}
</style>