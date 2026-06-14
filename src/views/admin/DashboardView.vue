<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 bg-dark text-white p-4 rounded shadow-lg">
      <div>
        <h1 class="h3 mb-1">🛠️ Panel de Administración</h1>
        <p class="mb-0 text-light opacity-75">Bienvenido Tutor/Profesor. Gestión del sistema educativo integrado.</p>
      </div>
      <router-link to="/admin/management" class="btn btn-warning fw-bold shadow-sm">
        📖 Ver Lecciones
      </router-link>
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
            <h3 class="display-5 fw-bold mb-0">{{ totalNivelMax }}</h3>
            <p class="card-text text-uppercase small tracking-wider mb-0 mt-1">En Nivel Avanzado (N4)</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0 fw-bold">👥 Listado de Alumnos</h5>
        <span class="badge bg-light text-dark">{{ totalAlumnos }} en total</span>
      </div>
      <div class="card-body p-0">
        <UserTable 
          :usuarios="listaAlumnosMapeados" 
          @eliminarUsuario="manejarEliminarAlumno"
          @verProgreso="mostrarAlertaProgreso"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { database } from '@/database/db' // Tu db.js de Dexie
import UserTable from '@/components/admin/UserTable.vue'

const listaAlumnosRaw = ref([])

// --- MÉTODOS DE ALUMNOS ---
const cargarAlumnos = async () => {
  try {
    listaAlumnosRaw.value = await database.usuarios.where('rol').equals('child').toArray()
  } catch (error) {
    console.error("Error al leer alumnos:", error)
  }
}

const listaAlumnosMapeados = computed(() => {
  if (!Array.isArray(listaAlumnosRaw.value)) return []
  return listaAlumnosRaw.value.map(alumno => {
    const progresoCalculado = alumno.nivel ? alumno.nivel * 25 : 0
    return {
      id: alumno.id,
      nombre: `${alumno.nombre || 'Niño'} ${alumno.apellido || ''}`.trim(),
      edad: alumno.edad || 0,
      progreso: progresoCalculado > 100 ? 100 : progresoCalculado
    }
  })
})

const manejarEliminarAlumno = async (idAlumno) => {
  if (confirm("¿Estás seguro de que deseas dar de baja a este alumno?")) {
    try {
      await database.usuarios.delete(idAlumno)
      await cargarAlumnos()
    } catch (error) {
      console.error("Error al eliminar alumno:", error)
    }
  }
}

const mostrarAlertaProgreso = (user) => {
  alert(`📊 Avance de ${user.nombre}:\nSu progreso estimado es del ${user.progreso}%.`)
}

// KPIs de Alumnos
const totalAlumnos = computed(() => listaAlumnosRaw.value.length)
const promedioProgreso = computed(() => {
  if (listaAlumnosRaw.value.length === 0) return 0
  const sumaNiveles = listaAlumnosRaw.value.reduce((acc, al) => acc + (al.nivel || 1), 0)
  return Math.round((sumaNiveles / (listaAlumnosRaw.value.length * 4)) * 100)
})
const totalNivelMax = computed(() => listaAlumnosRaw.value.filter(al => al.nivel === 4).length)

onMounted(() => {
  cargarAlumnos()
})
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,0.15) !important;
}
</style>