<template>
  <Navbar />

  <main class="container py-4 pt-5 mt-5 min-vh-100">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary">Mi Perfil</h1>
      <p class="lead text-secondary">
        {{
          authStore.esAdmin
            ? 'Gestiona tu información personal y credenciales de acceso.'
            : '¡Mira todo lo que has logrado hasta ahora!'
        }}
      </p>
    </header>

    <section
      v-if="authStore.esAdmin"
      aria-labelledby="admin-title"
      class="row justify-content-center"
    >
      <div class="col-12 col-md-8 col-lg-6">
        <article class="card shadow-lg border-0 rounded-4">
          <header class="card-header bg-dark text-white py-3">
            <h2 id="admin-title" class="h5 mb-0 fw-bold">⚙️ Datos de la Cuenta</h2>
          </header>

          <div class="card-body p-4">
            <div
              v-if="adminStore.mensajeExito"
              class="alert alert-success text-center fw-bold shadow-sm"
            >
              {{ adminStore.mensajeExito }}
            </div>
            <div
              v-if="adminStore.mensajeError"
              class="alert alert-danger text-center fw-bold shadow-sm"
            >
              {{ adminStore.mensajeError }}
            </div>
            <div v-if="errorLocal" class="alert alert-warning text-center fw-bold shadow-sm">
              {{ errorLocal }}
            </div>

            <form @submit.prevent="guardarCambiosAdmin">
              <div class="mb-3">
                <label for="nombreAdmin" class="form-label fw-bold text-secondary"
                  >Nombre Completo</label
                >
                <input
                  type="text"
                  id="nombreAdmin"
                  v-model="formAdmin.nombre"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="usuarioAdmin" class="form-label fw-bold text-secondary"
                  >Usuario de Acceso</label
                >
                <input
                  type="text"
                  id="usuarioAdmin"
                  v-model="formAdmin.usuario"
                  class="form-control"
                  required
                />
              </div>

              <hr class="my-4 text-muted" />

              <h3 class="h6 fw-bold text-primary mb-3">🔒 Cambiar Contraseña (Opcional)</h3>
              <p class="small text-muted mb-3">
                Si no deseas cambiarla, deja estos campos en blanco.
              </p>

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label for="passAdmin" class="form-label fw-bold text-secondary small"
                    >Nueva Contraseña</label
                  >
                  <input
                    type="password"
                    id="passAdmin"
                    v-model="formAdmin.password"
                    class="form-control"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div class="col-md-6">
                  <label for="passConfirm" class="form-label fw-bold text-secondary small"
                    >Confirmar Contraseña</label
                  >
                  <input
                    type="password"
                    id="passConfirm"
                    v-model="formAdmin.confirmPassword"
                    class="form-control"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 fw-bold fs-5 shadow-sm"
                :disabled="adminStore.cargando"
              >
                <span
                  v-if="adminStore.cargando"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{ adminStore.cargando ? 'Guardando...' : '💾 Actualizar Mis Datos' }}
              </button>
            </form>
          </div>
        </article>
      </div>
    </section>

    <section
      v-else-if="authStore.esChild"
      aria-labelledby="child-title"
      class="row justify-content-center"
    >
      <div class="col-12 col-md-10 col-lg-8">
        <article class="card shadow-lg border-0 rounded-4 overflow-hidden">
          <header class="bg-info text-white py-5 text-center position-relative">
            <h2 id="child-title" class="display-4 fw-bold mb-0">
              ¡Hola, {{ authStore.usuarioActual?.nombre }}! 🌟
            </h2>
            <p class="fs-5 mb-0 mt-2 opacity-75">Este es tu carnet de superhéroe del aprendizaje</p>
          </header>

          <div class="card-body p-5 bg-light">
            <div class="row g-4 text-center">
              <div class="col-12 col-sm-4">
                <div
                  class="p-4 bg-white rounded-4 shadow-sm border border-2 border-primary h-100 hover-card"
                >
                  <div class="display-1 mb-2">🎓</div>
                  <h3 class="h5 fw-bold text-secondary mb-1">Nivel Actual</h3>
                  <p class="fs-4 fw-bold text-primary mb-0">
                    Nivel {{ authStore.usuarioActual?.nivel || 1 }}
                  </p>
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div
                  class="p-4 bg-white rounded-4 shadow-sm border border-2 border-warning h-100 hover-card"
                >
                  <div class="display-1 mb-2 kid-medal">🏅</div>
                  <h3 class="h5 fw-bold text-secondary mb-1">Medallas</h3>
                  <p class="fs-4 fw-bold text-warning mb-0">
                    {{ authStore.usuarioActual?.medallasCount || 0 }} Ganadas
                  </p>
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div
                  class="p-4 bg-white rounded-4 shadow-sm border border-2 border-success h-100 hover-card"
                >
                  <div class="display-1 mb-2">🎂</div>
                  <h3 class="h5 fw-bold text-secondary mb-1">Edad</h3>
                  <p class="fs-4 fw-bold text-success mb-0">
                    {{ authStore.usuarioActual?.edad || '?' }} años
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-5 text-center">
              <h4 class="fw-bold text-muted mb-3">¿Listo para seguir aprendiendo?</h4>
              <router-link
                :to="`/juego/nivel-${authStore.usuarioActual?.nivel || 1}`"
                class="btn btn-lg btn-success fw-bold px-5 shadow-sm rounded-pill btn-kid-play"
              >
                🎮 ¡Ir a jugar ahora!
              </router-link>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>

  <Footer />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/adminStore'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'

const authStore = useAuthStore()
const adminStore = useAdminStore()

// Variables locales solo para el Admin
const errorLocal = ref('')
const formAdmin = ref({
  nombre: '',
  usuario: '',
  password: '',
  confirmPassword: '',
})

// Cargar los datos del admin en el formulario cuando entra a la página
onMounted(() => {
  if (authStore.esAdmin && authStore.usuarioActual) {
    formAdmin.value.nombre = authStore.usuarioActual.nombre
    formAdmin.value.usuario = authStore.usuarioActual.nombreusuario
  }
})

// Limpiar mensajes si el usuario se va a otra página
onUnmounted(() => {
  adminStore.limpiarMensajes()
})

// Lógica de Validación y Guardado para el Administrador
const guardarCambiosAdmin = async () => {
  errorLocal.value = ''
  adminStore.limpiarMensajes()

  // 1. Validar que los campos obligatorios no sean solo espacios
  if (!formAdmin.value.nombre.trim() || !formAdmin.value.usuario.trim()) {
    errorLocal.value = 'El nombre y el usuario no pueden estar vacíos.'
    return
  }

  // 2. Si escribió una contraseña nueva, validar que coincida con la confirmación
  if (formAdmin.value.password || formAdmin.value.confirmPassword) {
    if (formAdmin.value.password !== formAdmin.value.confirmPassword) {
      errorLocal.value = 'Las contraseñas nuevas no coinciden. Verifícalas.'
      return
    }
  }

  // Empaquetar los datos para el Store
  const datosAEnviar = {
    nombre: formAdmin.value.nombre,
    usuario: formAdmin.value.usuario,
    password: formAdmin.value.password, // Si está vacío, el adminStore lo ignora de forma inteligente
  }

  // Llamar al adminStore
  const exito = await adminStore.actualizarPerfilAdmin(authStore.usuarioActual.id, datosAEnviar)

  // impiar al ser el cambio exitoso
  if (exito) {
    formAdmin.value.password = ''
    formAdmin.value.confirmPassword = ''
  }
}
</script>

<style scoped>
/* Transición suave para las tarjetas infantiles */
.hover-card {
  transition:
    transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
}

/* Animación de rotación */
.kid-medal {
  display: inline-block;
  animation: spinMedalHorizontal 4s linear infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
  user-select: none;
}

/* Al poner el mouse sobre la tarjeta acelera el volteo horizontal */
.hover-card:hover .kid-medal {
  animation-duration: 1.8s;
}

/* Efecto para el botón de ir a jugar */
.btn-kid-play {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.btn-kid-play:hover {
  transform: scale(1.05) rotate(-1deg);
}

/* Definición de la animación usando rotateY para giro de izquierda a derecha */
@keyframes spinMedalHorizontal {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
</style>
