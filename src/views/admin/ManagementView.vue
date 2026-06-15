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

    <div class="row g-4">
      <div class="col-12 col-lg-5">
        <LessonForm 
          :leccionToEdit="leccionSeleccionada" 
          @guardarLeccion="manejarGuardarLeccion"
        />
        <button 
          v-if="leccionSeleccionada" 
          @click="limpiarEdicion" 
          class="btn btn-sm btn-danger w-100 mt-2 fw-bold"
        >
          ❌ Cancelar Edición Actual
        </button>
      </div>

      <div class="col-12 col-lg-7">
        <div class="card shadow-sm border-0 my-3">
          <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0 fw-bold">📖 Lecciones Disponibles</h5>
            <span class="badge bg-light text-dark">{{ listaLecciones.length }} lecciones</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0 bg-white">
                <thead class="table-dark">
                  <tr>
                    <th>Nivel</th>
                    <th>Título / Dinámica</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="leccion in listaLecciones" :key="leccion.id">
                    <td>
                      <span class="badge bg-info text-dark fw-bold">Nivel {{ leccion.nivel }}</span>
                    </td>
                    <td>
                      <div class="fw-bold">{{ leccion.titulo }}</div>
                      <small class="text-muted d-inline-block text-truncate" style="max-width: 250px;">
                        {{ leccion.contenido || leccion.descripcion || 'Sin descripción' }}
                      </small>
                    </td>
                    <td class="text-center">
                      <div class="btn-group btn-group-sm">
                        <button @click="seleccionarParaEditar(leccion)" class="btn btn-outline-primary" title="Editar">
                          ✏️
                        </button>
                        <button @click="eliminarLeccion(leccion.id)" class="btn btn-outline-danger" title="Eliminar">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="listaLecciones.length === 0">
                    <td colspan="3" class="text-center py-4 text-muted">
                      No hay lecciones registradas. ¡Crea la primera usando el formulario!
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { database } from '@/database/db' // Ruta exacta verificada
import LessonForm from '@/components/admin/LessonForm.vue'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
const listaLecciones = ref([])
const leccionSeleccionada = ref(null)

const cargarLecciones = async () => {
  try {
    listaLecciones.value = await database.lecciones.toArray()
  } catch (error) {
    console.error("Error al cargar lecciones de Dexie:", error)
  }
}

onMounted(() => {
  cargarLecciones()
})

const seleccionarParaEditar = (leccion) => {
  leccionSeleccionada.value = { ...leccion }
}

const limpiarEdicion = () => {
  leccionSeleccionada.value = null
}

const manejarGuardarLeccion = async (datosLeccion) => {
  try {
    if (datosLeccion.id) {
      await database.lecciones.update(datosLeccion.id, datosLeccion)
    } else {
      await database.lecciones.add(datosLeccion)
    }
    leccionSeleccionada.value = null
    await cargarLecciones()
  } catch (error) {
    console.error("Error al procesar la lección en Dexie:", error)
  }
}

const eliminarLeccion = async (idLeccion) => {
  if (confirm("¿Seguro que deseas eliminar esta lección del catálogo infantil?")) {
    try {
      await database.lecciones.delete(idLeccion)
      await cargarLecciones()
    } catch (error) {
      console.error("Error al borrar la lección de Dexie:", error)
    }
  }
}
</script>