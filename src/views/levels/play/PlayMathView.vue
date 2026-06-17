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
  name: 'PlayMathView',
  components: { ProgressBar },
  data() {
    return {
      leccion: null,
      cargando: true,
      preguntaActualIndex: 0,
      respuestaUsuario: null,
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
    ejercicioActual() {
      return this.leccion?.contenido[this.preguntaActualIndex]
    },
    esUltimo() {
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
    verificar() {
      if (this.respuestaUsuario === null || this.respuestaUsuario === '') return
      this.respuestaCorrecta = Number(this.respuestaUsuario) === Number(this.ejercicioActual.respuestaCorrecta)
      if (this.respuestaCorrecta) this.aciertos++
      this.respondida = true
    },
    siguiente() {
      if (this.esUltimo) {
        this.juegoTerminado = true
        return
      }
      this.preguntaActualIndex++
      this.respuestaUsuario = null
      this.respondida = false
      this.respuestaCorrecta = false
    },
    reiniciar() {
      this.preguntaActualIndex = 0
      this.respuestaUsuario = null
      this.respondida = false
      this.respuestaCorrecta = false
      this.aciertos = 0
      this.juegoTerminado = false
    }
  }
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