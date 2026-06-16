<template>
  <Navbar />
  <!-- Uso de la etiqueta semántica <main> para el contenido principal -->
  <main class="container py-4 pt-5 mt-5">
    
    <!-- Etiqueta <header> para el encabezado del panel -->
    <header class="d-flex justify-content-between align-items-center mb-4 bg-dark text-white p-4 rounded shadow-lg">
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
    </header>

    <!-- Etiqueta <section> para las tarjetas de KPIs -->
    <section aria-labelledby="kpis-title" class="row g-4 mb-5">
      <h2 id="kpis-title" class="visually-hidden">Resumen de Estadísticas</h2>
      
      <div class="col-12 col-md-4">
        <article class="card bg-primary text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0">{{ totalAlumnos }}</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1">Niños Registrados</p>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-4">
        <article class="card bg-success text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0">{{ promedioProgreso }}%</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1">Progreso Promedio</p>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-4">
        <article class="card bg-info text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0 text-dark">{{ totalNivel1 }}</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1 text-dark">
              Alumnos en Nivel 1
            </p>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-4">
        <article class="card bg-info text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0 text-dark">{{ totalNivel2 }}</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1 text-dark">
              Alumnos en Nivel 2
            </p>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-4">
        <article class="card bg-info text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0 text-dark">{{ totalNivel3 }}</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1 text-dark">
              Alumnos en Nivel 3
            </p>
          </div>
        </article>
      </div>
      <div class="col-12 col-md-4">
        <article class="card bg-info text-white h-100 shadow-sm border-0 hover-card">
          <div class="card-body d-flex flex-column justify-content-center align-items-center py-4">
            <h3 class="display-5 fw-bold mb-0 text-dark">{{ totalNivel4 }}</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1 text-dark">
              Alumnos en Nivel 4
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Etiqueta <section> para la tabla de usuarios -->
    <section aria-labelledby="table-title">
      <h2 id="table-title" class="visually-hidden">Lista de Alumnos Registrados</h2>
      <!-- Consumimos listaAlumnosMapeados que ya incluye toda la información extra -->
      <UserTable
        :usuarios="childStore.listaAlumnosMapeados"
        @verProgreso="mostrarDetalle"
        @eliminarUsuario="confirmarEliminacion"
        @editarUsuario="prepararEdicion"
      />
    </section>

    <!-- Modales de Confirmación y Detalles -->
    <div v-if="mostrarModalEliminar" class="modal d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">⚠️ Confirmar Baja</h5>
            <button type="button" class="btn-close btn-close-white" @click="mostrarModalEliminar = false"></button>
          </div>
          <div class="modal-body text-center p-4">
            <h1 class="display-1 mb-3">🗑️</h1>
            <p class="fs-5">
              ¿Estás seguro de que deseas dar de baja a este alumno? Toda su información y progreso se perderá.
            </p>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary fw-bold px-4" @click="mostrarModalEliminar = false">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger fw-bold px-4" @click="ejecutarEliminacion">
              Sí, dar de baja
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="alumnoSeleccionado" class="modal d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title fw-bold">📊 Avance de {{ alumnoSeleccionado.nombre }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="alumnoSeleccionado = null"></button>
          </div>
          <div class="modal-body text-center p-5">
            <h2 class="display-3 fw-bold text-info mb-0">{{ alumnoSeleccionado.progreso }}%</h2>
            <p class="text-muted fw-bold mb-4">Progreso estimado del nivel actual</p>
            <div class="progress rounded-pill shadow-sm" style="height: 25px">
              <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" :style="{ width: alumnoSeleccionado.progreso + '%' }"></div>
            </div>
          </div>
          <div class="modal-footer justify-content-center border-0">
            <button type="button" class="btn btn-primary fw-bold px-5 rounded-pill" @click="alumnoSeleccionado = null">
              ¡Entendido!
            </button>
          </div>
        </div>
      </div>
    </div>

  </main>
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

const mostrarModalEliminar = ref(false)
const idAEliminar = ref(null)
const alumnoSeleccionado = ref(null)

const irARegistro = () => {
  router.push({name: 'register'})
}

onMounted(async () => {
  await childStore.cargarAlumnos()
})

// KPIs
const totalAlumnos = computed(() => childStore.totalAlumnos)
const promedioProgreso = computed(() => childStore.promedioProgreso)
const totalNivel4 = computed(() => childStore.totalNivel4)
const totalNivel3 = computed(()=> childStore.totalNivel3)
const totalNivel2 = computed(()=> childStore.totalNivel2)
const totalNivel1 = computed(()=> childStore.totalNivel1)



// Función temporal para cuando definamos qué hacer con la edición
const prepararEdicion = (user) => {
  console.log('Botón editar clickeado. Alumno seleccionado:', user)
  // Aquí irá la lógica que me indicarás a continuación
}

const confirmarEliminacion = (idAlumno) => {
  idAEliminar.value = idAlumno
  mostrarModalEliminar.value = true
}

const ejecutarEliminacion = async () => {
  if (idAEliminar.value) {
    await childStore.eliminarAlumno(idAEliminar.value)
    mostrarModalEliminar.value = false
    idAEliminar.value = null
  }
}

const mostrarDetalle = (user) => {
  alumnoSeleccionado.value = user
}
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}
</style>