<template>
  <Navbar/>
  
  <div class="container py-4 pt-5 mt-5">
    
    <div class="d-flex justify-content-between align-items-center mb-4 bg-secondary text-white p-4 rounded shadow-lg">
      <div>
        <h1 class="h3 mb-1">📚 Gestión del Contenido Educativo</h1>
        <p class="mb-0 text-white-50">Crea, edita o elimina los minijuegos de los niños.</p>
      </div>
      <router-link to="/admin/dashboard" class="btn btn-light fw-bold shadow-sm">
        👥 Ver Alumnos
      </router-link>
    </div>

    <div v-if="leccionesStore.mensajeExito" class="alert alert-success fw-bold text-center shadow-sm">
      {{ leccionesStore.mensajeExito }}
    </div>
    <div v-if="leccionesStore.mensajeError" class="alert alert-danger fw-bold text-center shadow-sm">
      {{ leccionesStore.mensajeError }}
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-5">
        <LessonForm 
          :leccionToEdit="leccionSeleccionada" 
          :cargando="leccionesStore.cargando"
          :resetSignal="resetFormulario"
          @guardarLeccion="manejarGuardarLeccion"
          @cancelar="limpiarEdicion"
        />
        
        <button 
          v-if="leccionSeleccionada" 
          @click="limpiarEdicion" 
          class="btn btn-sm btn-danger w-100 mt-2 fw-bold shadow-sm"
        >
          ❌ Cancelar Edición Actual
        </button>
      </div>

      <div class="col-12 col-lg-7">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0 fw-bold">📖 Catálogo de Minijuegos</h5>
            <span class="badge bg-warning text-dark fw-bold px-3">
              {{ leccionesStore.listaLecciones.length }} Activas
            </span>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 bg-white">
              <thead class="table-light">
                <tr>
                  <th scope="col" class="ps-4">Título del Juego</th>
                  <th scope="col">Rango/Nivel</th>
                  <th scope="col">Preguntas</th>
                  <th scope="col" class="text-end pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="leccionesStore.listaLecciones.length === 0">
                  <td colspan="4" class="text-center py-4 text-muted">
                    No hay lecciones creadas en este momento. ¡Crea la primera!
                  </td>
                </tr>

                <tr v-for="leccion in leccionesStore.listaLecciones" :key="leccion.id">
                  <td class="ps-4 fw-bold text-secondary">{{ leccion.titulo }}</td>
                  <td>
                    <span class="badge rounded-pill bg-info text-dark fw-bold">
                      Nivel {{ leccion.nivel }}
                    </span>
                  </td>
                  <td>
                    <span class="text-muted small">
                      {{ Array.isArray(leccion.contenido) ? leccion.contenido.length : 1 }} pág(s).
                    </span>
                  </td>
                  <td class="text-end pe-4">
                    <div class="btn-group gap-1">
                      <button 
                        @click="seleccionarParaEditar(leccion)" 
                        class="btn btn-sm btn-outline-primary fw-bold"
                        title="Editar parámetros del juego"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        @click="confirmarEliminacion(leccion.id)" 
                        class="btn btn-sm btn-outline-danger fw-bold"
                        title="Remover lección por completo"
                      >
                        ❌ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalEliminar" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">⚠ ¿Eliminar Lección?</h5>
            <button type="button" class="btn-close btn-close-white" @click="mostrarModalEliminar = false"></button>
          </div>
          <div class="modal-body py-4">
            <p class="mb-0 fs-5 text-secondary">¿Estás completamente seguro de que deseas eliminar esta lección del catálogo infantil? Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer bg-light border-0">
            <button type="button" class="btn btn-outline-secondary fw-bold px-4" @click="mostrarModalEliminar = false">Cancelar</button>
            <button type="button" class="btn btn-danger fw-bold px-4" @click="ejecutarEliminacion">Sí, eliminar lección</button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <Footer/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLeccionesStore } from '@/stores/leccionesStore'
import LessonForm from '@/components/admin/LessonForm.vue'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'

const leccionesStore = useLeccionesStore()
const leccionSeleccionada = ref(null)
const resetFormulario = ref(0) // 🆕 Señal de reset: cada vez que sube en 1, LessonForm la detecta y limpia

const mostrarModalEliminar = ref(false)
const idAEliminar = ref(null)

onMounted(async () => {
  await leccionesStore.cargarLecciones()
})

const seleccionarParaEditar = (leccion) => {
  leccionSeleccionada.value = JSON.parse(JSON.stringify(leccion))
}

const limpiarEdicion = () => {
  leccionSeleccionada.value = null
  resetFormulario.value++ // 🆕 Incrementar dispara el watch en LessonForm
}

const manejarGuardarLeccion = async (datosLeccion) => {
  const exito = await leccionesStore.guardarLeccion(datosLeccion)
  if (exito) {
    limpiarEdicion()
  }
}

const confirmarEliminacion = (idLeccion) => {
  idAEliminar.value = idLeccion
  mostrarModalEliminar.value = true
}

const ejecutarEliminacion = async () => {
  if (idAEliminar.value) {
    await leccionesStore.eliminarLeccion(idAEliminar.value)
    idAEliminar.value = null
    mostrarModalEliminar.value = false
  }
}
</script>