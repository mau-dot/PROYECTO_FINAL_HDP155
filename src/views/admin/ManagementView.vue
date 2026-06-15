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

    <div v-if="leccionesStore.mensajeExito" class="alert alert-success fw-bold text-center">
      {{ leccionesStore.mensajeExito }}
    </div>
    <div v-if="leccionesStore.mensajeError" class="alert alert-danger fw-bold text-center">
      {{ leccionesStore.mensajeError }}
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-5">
        <LessonForm 
          :leccionToEdit="leccionSeleccionada" 
          @guardarLeccion="manejarGuardarLeccion"
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
        <div class="card shadow-sm border-0 my-3">
          <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0 fw-bold">📖 Lecciones Disponibles</h5>
            <span class="badge bg-light text-dark fw-bold">{{ leccionesStore.listaLecciones.length }} en total</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover table-striped mb-0 align-middle">
                <thead class="table-secondary">
                  <tr>
                    <th class="ps-3">Nivel</th>
                    <th>Título de la Lección</th>
                    <th>Tipo</th>
                    <th class="text-end pe-3">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="leccionesStore.cargando">
                    <td colspan="4" class="text-center text-muted py-4 fw-bold">Cargando lecciones... ⏳</td>
                  </tr>
                  <tr v-else-if="leccionesStore.listaLecciones.length === 0">
                    <td colspan="4" class="text-center text-muted py-4">No hay lecciones registradas aún.</td>
                  </tr>
                  <tr v-else v-for="leccion in leccionesStore.listaLecciones" :key="leccion.id">
                    <td class="ps-3"><span class="badge bg-info text-dark shadow-sm">Nivel {{ leccion.nivel }}</span></td>
                    <td class="fw-bold text-secondary">{{ leccion.titulo }}</td>
                    <td><span class="badge bg-light text-secondary border">{{ leccion.tipo }}</span></td>
                    <td class="text-end pe-3">
                      <button @click="seleccionarParaEditar(leccion)" class="btn btn-sm btn-warning me-2 fw-bold shadow-sm" title="Editar Lección">✏️</button>
                      <button @click="confirmarEliminacion(leccion.id)" class="btn btn-sm btn-danger fw-bold shadow-sm" title="Eliminar Lección">🗑️</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalEliminar" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">⚠️ Confirmar Borrado</h5>
            <button type="button" class="btn-close btn-close-white" @click="mostrarModalEliminar = false"></button>
          </div>
          <div class="modal-body text-center p-4">
            <h1 class="display-1 mb-3">🔥</h1>
            <p class="fs-5">¿Seguro que deseas eliminar esta lección del catálogo infantil? Esto no se puede deshacer.</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary fw-bold px-4" @click="mostrarModalEliminar = false">Cancelar</button>
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

const mostrarModalEliminar = ref(false)
const idAEliminar = ref(null)

onMounted(async () => {
  // Llama a Pinia en lugar de Dexie
  await leccionesStore.cargarLecciones()
})

const seleccionarParaEditar = (leccion) => {
  leccionSeleccionada.value = { ...leccion }
}

const limpiarEdicion = () => {
  leccionSeleccionada.value = null
}

const manejarGuardarLeccion = async (datosLeccion) => {
  // El store se encarga de saber si actualiza o crea
  await leccionesStore.guardarLeccion(datosLeccion)
  limpiarEdicion()
}

const confirmarEliminacion = (idLeccion) => {
  idAEliminar.value = idLeccion
  mostrarModalEliminar.value = true
}

const ejecutarEliminacion = async () => {
  if (idAEliminar.value) {
    await leccionesStore.eliminarLeccion(idAEliminar.value)
    mostrarModalEliminar.value = false
    idAEliminar.value = null
  }
}
</script>