<template>
  <Navbar />
  <div class="container py-4 pt-5 mt-5">
    <div
      class="d-flex justify-content-between align-items-center mb-4 bg-dark text-white p-4 rounded shadow-lg"
    >
      <div>
        <h1 class="h3 mb-1">🛠️ Panel de Administración</h1>
        <p class="mb-0 text-light opacity-75">
          Bienvenido Tutor/Profesor. Gestión del sistema educativo integrado.
        </p>
      </div>
      <div class="d-flex gap-2">
        <button type="button" @click="irARegistro" class="btn btn-outline-light fw-bold shadow-sm">
          ➕ Registrar Alumno
        </button>
        <router-link to="/admin/management" class="btn btn-warning fw-bold shadow-sm">
          📖 Ver Lecciones
        </router-link>
      </div>
    </div>

    <div class="row g-4 mb-5">
      <div class="col-12 col-md-4">
        <div class="card bg-primary text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0">{{ totalAlumnos }}</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1">Niños Registrados</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card bg-success text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0">{{ promedioProgreso }}%</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1">Progreso Promedio</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card bg-info text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0 text-dark">{{ totalNivelMax }}</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1 text-dark">
              Alumnos en Nivel 4
            </p>
          </div>
        </div>
      </div>
    </div>

    <UserTable
      :usuarios="listaParaTabla"
      @verProgreso="mostrarDetalle"
      @eliminarUsuario="confirmarEliminacion"
    />

    <div
      v-if="mostrarModalEliminar"
      class="modal d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">⚠️ Confirmar Baja</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="mostrarModalEliminar = false"
            ></button>
          </div>
          <div class="modal-body text-center p-4">
            <h1 class="display-1 mb-3">🗑️</h1>
            <p class="fs-5">
              ¿Estás seguro de que deseas dar de baja a este alumno? Toda su información y progreso
              se perderá.
            </p>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              type="button"
              class="btn btn-secondary fw-bold px-4"
              @click="mostrarModalEliminar = false"
            >
              Cancelar
            </button>
            <button type="button" class="btn btn-danger fw-bold px-4" @click="ejecutarEliminacion">
              Sí, dar de baja
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="alumnoSeleccionado"
      class="modal d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title fw-bold">📊 Avance de {{ alumnoSeleccionado.nombre }}</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="alumnoSeleccionado = null"
            ></button>
          </div>
          <div class="modal-body text-center p-5">
            <h2 class="display-3 fw-bold text-info mb-0">{{ alumnoSeleccionado.progreso }}%</h2>
            <p class="text-muted fw-bold mb-4">Progreso estimado del nivel actual</p>
            <div class="progress rounded-pill shadow-sm" style="height: 25px">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated bg-info"
                :style="{ width: alumnoSeleccionado.progreso + '%' }"
              ></div>
            </div>
          </div>
          <div class="modal-footer justify-content-center border-0">
            <button
              type="button"
              class="btn btn-primary fw-bold px-5 rounded-pill"
              @click="alumnoSeleccionado = null"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChildStore } from '@/stores/childStore'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import UserTable from '@/components/admin/UserTable.vue'

const childStore = useChildStore()
const router = useRouter()

// Variables para los modales
const mostrarModalEliminar = ref(false)
const idAEliminar = ref(null)
const alumnoSeleccionado = ref(null)

const irARegistro = () => {
  router.push({name: 'register'})
}

onMounted(async () => {
  // Ahora la vista solo le dice al store "trae los datos"
  await childStore.cargarAlumnos()
})

// Adaptamos los datos crudos del store al formato de la tabla
const listaParaTabla = computed(() => {
  if (!childStore.listaAlumnos || childStore.listaAlumnos.length === 0) return []
  return childStore.listaAlumnos.map((alumno) => {
    const progresoCalculado = alumno.nivel ? alumno.nivel * 25 : 0
    return {
      id: alumno.id,
      nombre: alumno.nombre || 'Niño',
      edad: alumno.edad || 0,
      progreso: progresoCalculado > 100 ? 100 : progresoCalculado,
      nivel: alumno.nivel,
    }
  })
})

// KPIs conectados a Pinia
const totalAlumnos = computed(() => childStore.listaAlumnos.length)
const promedioProgreso = computed(() => {
  if (childStore.listaAlumnos.length === 0) return 0
  const sumaNiveles = childStore.listaAlumnos.reduce((acc, al) => acc + (al.nivel || 1), 0)
  return Math.round((sumaNiveles / (childStore.listaAlumnos.length * 4)) * 100)
})
const totalNivelMax = computed(() => childStore.listaAlumnos.filter((a) => a.nivel === 4).length)

// Manejo de Eliminación con Modal
const confirmarEliminacion = (idAlumno) => {
  idAEliminar.value = idAlumno
  mostrarModalEliminar.value = true
}

const ejecutarEliminacion = async () => {
  if (idAEliminar.value) {
    await childStore.eliminarNino(idAEliminar.value) // Llama a Pinia
    mostrarModalEliminar.value = false
    idAEliminar.value = null
  }
}

// Mostrar Progreso con Modal
const mostrarDetalle = (user) => {
  alumnoSeleccionado.value = user
}
</script>

<style scoped>
.hover-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}
</style>
