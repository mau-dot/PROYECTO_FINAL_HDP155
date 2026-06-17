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
        <span class="badge bg-success mb-2">Opción múltiple</span>
        <h2 class="fw-bold text-primary">{{ leccion.titulo }}</h2>
        <p class="text-muted mb-0">{{ leccion.descripcion }}</p>
      </div>

      <!-- Progress Bar -->
      <ProgressBar :porcentaje="porcentaje" />

      <!-- Pregunta -->
      <div v-if="!juegoTerminado" class="card border-0 shadow-sm rounded-4 p-4 mb-3">
        <p class="fs-5 fw-bold text-center mb-3">{{ preguntaActual.pregunta }}</p>

        <div v-if="preguntaActual.imagen" class="text-center mb-3">
          <img
            :src="preguntaActual.imagen"
            alt="Imagen de la pregunta"
            class="img-fluid rounded-3"
            style="max-height: 200px; object-fit: contain;"
          />
        </div>

        <div class="row g-3 mt-1">
          <div v-for="opcion in preguntaActual.opciones" :key="opcion" class="col-12 col-md-6">
            <button
              class="btn w-100 fw-bold py-3 rounded-4 opcion-btn"
              :class="getOpcionClass(opcion)"
              :disabled="respondida"
              @click="responder(opcion)"
            >
              {{ opcion }}
            </button>
          </div>
        </div>

        <div v-if="respondida" class="mt-3 text-center">
          <p v-if="respuestaCorrecta" class="text-success fw-bold fs-5">¡Correcto! 🎉</p>
          <p v-else class="text-danger fw-bold fs-5">
            Casi... La correcta era: <strong>{{ preguntaActual.respuestaCorrecta }}</strong> 😊
          </p>
          <button class="btn btn-warning fw-bold px-4 mt-1" @click="siguiente">
            {{ esUltima ? 'Ver resultados 🏆' : 'Siguiente →' }}
          </button>
        </div>
      </div>

      <!-- Pantalla final -->
      <div v-else class="card border-0 shadow-sm rounded-4 p-5 text-center">
        <div class="fs-1 mb-2">🏆</div>
        <h3 class="fw-bold text-success">¡Lección completada!</h3>
        <p class="text-muted">
          Respondiste bien <strong>{{ aciertos }}</strong> de
          <strong>{{ leccion.contenido.length }}</strong> preguntas.
        </p>
        <div class="d-flex gap-3 justify-content-center mt-3">
          <button class="btn btn-outline-secondary fw-bold" @click="reiniciar">Intentar de nuevo</button>
          <button class="btn btn-warning fw-bold" @click="$router.go(-1)">Volver al nivel</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { database } from '@/database/db'
import ProgressBar from '@/components/game/ProgressBar.vue'

export default {
  name: 'PlayMultipleView',
  components: { ProgressBar },
  data() {
    return {
      leccion: null,
      cargando: true,
      preguntaActualIndex: 0,
      opcionSeleccionada: null,
      respondida: false,
      respuestaCorrecta: false,
      aciertos: 0,
      juegoTerminado: false
    }
  },
  computed: {
    porcentaje() {
      if (!this.leccion) return 0
      if (this.juegoTerminado) return 100
      return Math.round(((this.preguntaActualIndex + 1) / this.leccion.contenido.length) * 100)
    },
    preguntaActual() {
      return this.leccion?.contenido[this.preguntaActualIndex]
    },
    esUltima() {
      return this.preguntaActualIndex === this.leccion.contenido.length - 1
    }
  },
  async mounted() {
    await this.cargarLeccion()
  },
  methods: {
    async cargarLeccion() {
      try {
        const id = Number(this.$route.params.id)
        this.leccion = await database.lecciones.get(id)
      } catch (e) {
        console.error('Error cargando lección:', e)
      } finally {
        this.cargando = false
      }
    },
    getOpcionClass(opcion) {
      if (!this.respondida) return 'btn-outline-primary'
      if (opcion === this.preguntaActual.respuestaCorrecta) return 'btn-success text-white'
      if (opcion === this.opcionSeleccionada) return 'btn-danger text-white'
      return 'btn-outline-secondary'
    },
    responder(opcion) {
      this.opcionSeleccionada = opcion
      this.respondida = true
      this.respuestaCorrecta = opcion === this.preguntaActual.respuestaCorrecta
      if (this.respuestaCorrecta) this.aciertos++
    },
    siguiente() {
      if (this.esUltima) {
        this.juegoTerminado = true
        return
      }
      this.preguntaActualIndex++
      this.opcionSeleccionada = null
      this.respondida = false
      this.respuestaCorrecta = false
    },
    reiniciar() {
      this.preguntaActualIndex = 0
      this.opcionSeleccionada = null
      this.respondida = false
      this.respuestaCorrecta = false
      this.aciertos = 0
      this.juegoTerminado = false
    }
  }
}
</script>

<style scoped>
.opcion-btn { transition: transform 0.15s; }
.opcion-btn:hover:not(:disabled) { transform: scale(1.03); }
</style>