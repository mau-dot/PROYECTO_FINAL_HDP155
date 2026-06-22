<template>
  <Navbar />
  <main class="container py-4 pt-5 mt-5 min-vh-100">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <article class="card shadow-lg border-0 rounded-4 overflow-hidden">
          
          <header class="card-header bg-warning text-dark py-3 text-center border-0">
            <h1 class="h4 mb-0 fw-bold">✏️ Editar Perfil de Alumno</h1>
          </header>
          
          <div class="card-body p-4 bg-white">
            <div v-if="childStore.mensajeError" class="alert alert-danger text-center fw-bold shadow-sm">
              {{ childStore.mensajeError }}
            </div>
            <div v-if="errorLocal" class="alert alert-warning text-center fw-bold shadow-sm">
              {{ errorLocal }}
            </div>
            <div v-if="exito" class="alert alert-success text-center fw-bold shadow-sm">
              ¡Datos actualizados exitosamente! Volviendo al panel...
            </div>

            <div v-if="childStore.cargandoAlumno" class="text-center py-5">
              <div class="spinner-border text-warning" role="status"></div>
              <p class="mt-3 text-muted fw-bold">Cargando datos del alumno...</p>
            </div>

            <form v-else @submit.prevent="guardarCambios">
              
              <div class="mb-3">
                <label class="form-label fw-bold text-secondary small">Usuario (Nick de acceso)</label>
                <input type="text" class="form-control bg-light text-muted" :value="formulario.nombreusuario" disabled />
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label fw-bold text-secondary small">Nombre(s)</label>
                  <input type="text" class="form-control" v-model="formulario.nombre" required />
                </div>
                <div class="col-6">
                  <label class="form-label fw-bold text-secondary small">Apellido(s)</label>
                  <input type="text" class="form-control" v-model="formulario.apellido" required />
                </div>
              </div>

              <div class="row g-2 mb-4">
                <div class="col-6">
                  <label class="form-label fw-bold text-secondary small">Edad (años)</label>
                  <input type="number" class="form-control" v-model="formulario.edad" min="1" max="15" required />
                </div>
                <div class="col-6">
                  <label class="form-label fw-bold text-secondary small">Nivel</label>
                  <select v-model="formulario.nivel" class="form-select" required>
                    <option value="1">Nivel 1 (1-2 años)</option>
                    <option value="2">Nivel 2 (3-4 años)</option>
                    <option value="3">Nivel 3 (5-6 años)</option>
                    <option value="4">Nivel 4 (7-8 años)</option>
                  </select>
                </div>
              </div>

              <hr class="my-4 text-muted">

              <h3 class="h6 fw-bold text-primary mb-3">🔒 Cambiar Contraseña (Opcional)</h3>
              <p class="small text-muted mb-3">Déjalo en blanco si el alumno conservará su contraseña actual.</p>
              
              <div class="row g-2 mb-4">
                <div class="col-6">
                  <label class="form-label fw-bold text-secondary small">Nueva Contraseña</label>
                  <input type="password" class="form-control" v-model="formulario.password" placeholder="Mínimo 4 caracteres" />
                </div>
                <div class="col-6">
                  <label class="form-label fw-bold text-secondary small">Confirmar Contraseña</label>
                  <input type="password" class="form-control" v-model="confirmarPassword" placeholder="Repítela" />
                </div>
              </div>

              <div class="d-flex gap-3 mt-4">
                <button type="button" class="btn btn-outline-secondary w-50 fw-bold shadow-sm" @click="router.back()">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-warning w-50 fw-bold shadow-sm" :disabled="childStore.cargando || exito">
                  <span v-if="childStore.cargando" class="spinner-border spinner-border-sm me-2"></span>
                  {{ childStore.cargando ? 'Guardando...' : '💾 Guardar Cambios' }}
                </button>
              </div>

            </form>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChildStore } from '@/stores/childStore'
import Navbar from '@/components/common/Navbar.vue'

const route = useRoute()
const router = useRouter()
const childStore = useChildStore()

const exito = ref(false)
const errorLocal = ref('')
const confirmarPassword = ref('')

// El estado local del formulario
const formulario = ref({
  nombreusuario: '',
  nombre: '',
  apellido: '',
  edad: 1,
  nivel: '1',
  password: ''
})

const idNino = Number(route.params.id) // Sacamos el ID de la URL (/admin/editar-alumno/3)

onMounted(async () => {
  childStore.limpiarMensajes()
  errorLocal.value = ''
  
  if (!idNino) {
    errorLocal.value = 'ID de alumno no válido'
    return
  }

  // Cargar el alumno desde el store
  const alumno = await childStore.cargarAlumnoPorId(idNino)
  
  if (alumno) {
    // Pre-llenamos el formulario con lo que hay en BD
    formulario.value.nombreusuario = alumno.nombreusuario
    formulario.value.nombre = alumno.nombre
    formulario.value.apellido = alumno.apellido || ''
    formulario.value.edad = alumno.edad
    formulario.value.nivel = String(alumno.nivel) // Select usa strings generalmente
  } else if (childStore.mensajeError) {
    errorLocal.value = childStore.mensajeError
  }
})

onUnmounted(() => {
  childStore.limpiarMensajes()
})

const guardarCambios = async () => {
  errorLocal.value = ''
  childStore.limpiarMensajes()

  // Validación rapida: si escribio password, que coincidan
  if (formulario.value.password || confirmarPassword.value) {
    if (formulario.value.password !== confirmarPassword.value) {
      errorLocal.value = 'Las nuevas contraseñas no coinciden. Por favor revisa.'
      return
    }
  }

  // Preparamos el objeto copiando lo que hay en el formulario
  const datosAEnviar = {
    nombre: formulario.value.nombre.trim(),
    apellido: formulario.value.apellido.trim(),
    edad: Number(formulario.value.edad),
    nivel: Number(formulario.value.nivel)
  }

  // Si escribió una clave nueva, la agregamos al envío
  if (formulario.value.password) {
    datosAEnviar.password = formulario.value.password
  }

  // Ejecutar el store
  const resultado = await childStore.actualizarAlumno(idNino, datosAEnviar)

  if (resultado) {
    exito.value = true
    setTimeout(() => {
      router.push({ name: 'dashboard' }) // O router.back(), dependiendo de tus rutas
    }, 1500)
  }
}
</script>