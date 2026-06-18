<template>
  <div class="container py-4" style="max-width: 720px;">

    <button class="btn btn-outline-secondary btn-sm mb-4 fw-bold" @click="$router.go(-1)">
      ← Volver
    </button>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Cargando lección...</p>
    </div>

    <div v-else-if="!leccion" class="alert alert-danger text-center fw-bold">
      No se encontró esta lección.
    </div>

    <template v-else>
      <div class="text-center mb-4 p-4 rounded-4 bg-light border">
        <span class="badge bg-primary mb-2">Completar oración</span>
        <h2 class="fw-bold text-primary">{{ leccion.titulo }}</h2>
        <p class="text-muted mb-0">{{ leccion.descripcion }}</p>
      </div>

      <!-- Progress Bar -->
      <ProgressBar :porcentaje="porcentaje" />

      <!-- Ejercicio -->
      <div v-if="!juegoTerminado" class="card border-0 shadow-sm rounded-4 p-4 mb-3">

        <p class="fs-5 fw-bold text-center mb-4">
          {{ partes[0] }}
          <span
            class="hueco-drop px-3 py-1 rounded-3 mx-1"
            :class="estadoHueco"
            @dragover.prevent
            @drop="soltar"
          >
            {{ palabraEnHueco || '___' }}
          </span>
          {{ partes[1] }}
        </p>

        <div v-if="!respondida" class="d-flex gap-3 justify-content-center flex-wrap mt-2">
          <span
            v-for="palabra in palabrasDisponibles"
            :key="palabra"
            class="palabra-drag badge fs-6 px-4 py-2 rounded-pill"
            draggable="true"
            @dragstart="arrastrar(palabra)"
          >
            {{ palabra }}
          </span>
        </div>

        <div v-if="respondida" class="mt-3 text-center">
          <p v-if="respuestaCorrecta" class="text-success fw-bold fs-5">¡Correcto! 🎉</p>
          <p v-else class="text-danger fw-bold fs-5">
            Casi... La correcta era: <strong>{{ ejercicioActual.palabraCorrecta }}</strong> 😊
          </p>
          <button class="btn btn-primary fw-bold px-4 mt-1" @click="siguiente">
            {{ esUltimo ? 'Ver resultados 🏆' : 'Siguiente →' }}
          </button>
        </div>
      </div>

      <!-- Pantalla final -->
      <div v-else class="card border-0 shadow-sm rounded-4 p-5 text-center">
        <div class="fs-1 mb-2">🏆</div>
        <h3 class="fw-bold text-success">¡Lección completada!</h3>
        <p class="text-muted">
          Completaste bien <strong>{{ aciertos }}</strong> de
          <strong>{{ leccion.contenido.length }}</strong> ejercicios.
        </p>
        <!-- ✅ Mensaje extra si fue perfecta -->
        <p v-if="errores === 0" class="text-success fw-bold">
          ¡Sin errores! 🌟 La siguiente lección está desbloqueada.
        </p>
        <p v-else class="text-warning fw-bold">
          Tuviste {{ errores }} error(es). ¡Inténtalo de nuevo para desbloquear la siguiente!
        </p>
        <div class="d-flex gap-3 justify-content-center mt-3">
          <button class="btn btn-outline-secondary fw-bold" @click="reiniciar">Intentar de nuevo</button>
          <button class="btn btn-primary fw-bold" @click="$router.go(-1)">Volver al nivel</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLeccionesStore } from '@/stores/leccionesStore'  // ✅ usa el store (igual que los otros Play)
import ProgressBar from '@/components/game/ProgressBar.vue'

const route = useRoute()
const leccionesStore = useLeccionesStore()  // ✅ instancia del store

// ===== VARIABLES =====
const cargando = ref(true)
const leccion = ref(null)
const juegoTerminado = ref(false)
const preguntaActualIndex = ref(0)
const palabraEnHueco = ref(null)
const palabraArrastrada = ref(null)
const respondida = ref(false)
const respuestaCorrecta = ref(false)
const aciertos = ref(0)
const errores = ref(0)  // ✅ ya existía, ahora sí se pasa al guardar

// ===== COMPUTED =====
const ejercicioActual = computed(() => leccion.value?.contenido[preguntaActualIndex.value])
const esUltimo = computed(() => preguntaActualIndex.value === (leccion.value?.contenido.length - 1))
const porcentaje = computed(() => {
  if (!leccion.value) return 0
  if (juegoTerminado.value) return 100
  return Math.round(((preguntaActualIndex.value + 1) / leccion.value.contenido.length) * 100)
})
const partes = computed(() => ejercicioActual.value?.oracion.split('___') || ['', ''])

const palabrasDisponibles = computed(() => {
  if (!ejercicioActual.value) return []
  const arr = [
    ejercicioActual.value.palabraCorrecta,
    ejercicioActual.value.distractor
  ]
  return arr.sort(() => Math.random() - 0.5)
})

const estadoHueco = computed(() => {
  if (!respondida.value) return palabraEnHueco.value ? 'hueco-lleno' : 'hueco-vacio'
  return respuestaCorrecta.value ? 'hueco-correcto' : 'hueco-incorrecto'
})

// ===== CARGAR LECCIÓN =====
onMounted(async () => {
  try {
    const id = Number(route.params.id)
    // ✅ usa el store igual que PlayMathView y PlayMultipleView
    leccion.value = await leccionesStore.obtenerLeccionPorId(id)
  } catch (e) {
    console.error('Error cargando lección:', e)
  } finally {
    cargando.value = false
  }
})

// ===== MÉTODOS =====
const arrastrar = (palabra) => {
  palabraArrastrada.value = palabra
}

const soltar = () => {
  if (!palabraArrastrada.value) return
  palabraEnHueco.value = palabraArrastrada.value
  palabraArrastrada.value = null
  respuestaCorrecta.value = palabraEnHueco.value === ejercicioActual.value.palabraCorrecta
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
    // ✅ usa guardarProgreso del store, igual que los otros dos Play
    await leccionesStore.guardarProgreso(leccion.value, aciertos.value, errores.value)
    return
  }
  preguntaActualIndex.value++
  palabraEnHueco.value = null
  palabraArrastrada.value = null
  respondida.value = false
  respuestaCorrecta.value = false
}

const reiniciar = () => {
  preguntaActualIndex.value = 0
  palabraEnHueco.value = null
  palabraArrastrada.value = null
  respondida.value = false
  respuestaCorrecta.value = false
  aciertos.value = 0
  errores.value = 0
  juegoTerminado.value = false
}
</script>

<style scoped>
.hueco-vacio {
  background: #e9ecef; color: #aaa;
  border: 2px dashed #aaa;
  min-width: 80px; display: inline-block; text-align: center;
}
.hueco-lleno {
  background: #cfe2ff; color: #0d6efd;
  border: 2px solid #0d6efd;
  min-width: 80px; display: inline-block; text-align: center;
}
.hueco-correcto {
  background: #d1e7dd; color: #0f5132;
  border: 2px solid #0f5132;
  min-width: 80px; display: inline-block; text-align: center;
}
.hueco-incorrecto {
  background: #f8d7da; color: #842029;
  border: 2px solid #842029;
  min-width: 80px; display: inline-block; text-align: center;
}
.palabra-drag {
  background: #0d6efd; color: white;
  cursor: grab; user-select: none; transition: transform 0.15s;
}
.palabra-drag:hover { transform: scale(1.07); }
.palabra-drag:active { cursor: grabbing; }
</style>