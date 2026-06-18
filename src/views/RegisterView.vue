<template>
  <div class="register-page d-flex justify-content-center align-items-center min-vh-100 py-5">
    <div class="floating-bg-item item-1">🚀</div>
    <div class="floating-bg-item item-2">🎨</div>
    <div class="floating-bg-item item-3">🧩</div>
    <div class="floating-bg-item item-4">📐</div>

    <div class="card register-card shadow-lg p-4 p-md-5 border-0 rounded-5">
      <div class="kid-stars-decor">✨</div>

      <div class="text-center mb-4">
        <h2 class="kid-title h3 mb-1">🧒 Registrar Nuevo Alumno</h2>
        <p class="text-secondary fw-semibold">
          Crea un perfil para que el niño acceda a sus minijuegos
        </p>
      </div>

      <div
        v-if="childStore.mensajeError"
        class="alert alert-danger text-center rounded-4 fw-bold"
        role="alert"
      >
        {{ childStore.mensajeError }}
      </div>
      <div v-if="errorLocal" class="alert alert-warning text-center rounded-4 fw-bold" role="alert">
        {{ errorLocal }}
      </div>
      <div
        v-if="exitoRegistro"
        class="alert alert-success text-center rounded-4 fw-bold"
        role="alert"
      >
        ¡Alumno registrado exitosamente! Volviendo al panel...
      </div>

      <form @submit.prevent="procesarRegistro">
        <div class="row g-3 mb-3">
          <div class="col-6">
            <label class="form-label fw-bold text-secondary ps-1 small">Nombre(s)</label>
            <input
              type="text"
              class="form-control kid-input"
              v-model="formulario.nombre"
              placeholder="Ej: Juanito"
              required
            />
          </div>
          <div class="col-6">
            <label class="form-label fw-bold text-secondary ps-1 small">Apellido(s)</label>
            <input
              type="text"
              class="form-control kid-input"
              v-model="formulario.apellido"
              placeholder="Ej: Pérez"
              required
            />
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-6">
            <label class="form-label fw-bold text-secondary ps-1 small">Edad (años)</label>
            <input
              type="number"
              class="form-control kid-input"
              v-model="formulario.edad"
              min="1"
              max="12"
              placeholder="Ej: 4"
              required
            />
          </div>
          <div class="col-6">
            <label class="form-label fw-bold text-secondary ps-1 small"
              >Nivel Educativo Inicial</label
            >
            <select v-model="formulario.nivel" class="form-select kid-input" required>
              <option value="1">Nivel 1 (1-2 años)</option>
              <option value="2">Nivel 2 (3-4 años)</option>
              <option value="3">Nivel 3 (5-6 años)</option>
              <option value="4">Nivel 4 (7-8 años)</option>
            </select>
          </div>
        </div>

        <hr class="my-4 text-secondary opacity-25" />

        <div class="mb-3">
          <label class="form-label fw-bold text-secondary ps-1 small"
            >Usuario de acceso (Nickname)</label
          >
          <input
            type="text"
            class="form-control kid-input"
            v-model="formulario.nombreusuario"
            placeholder="Ej: juanito_p"
            required
          />
          <div class="form-text ps-1">Sin espacios. Solo letras, números y guión bajo (_).</div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-6">
            <label class="form-label fw-bold text-secondary ps-1 small">Contraseña / PIN</label>
            <input
              type="password"
              class="form-control kid-input"
              v-model="formulario.password"
              placeholder="Mínimo 4 caracteres"
              required
            />
          </div>
          <div class="col-6">
            <label class="form-label fw-bold text-secondary ps-1 small">Confirmar PIN</label>
            <input
              type="password"
              class="form-control kid-input"
              v-model="confirmarPassword"
              placeholder="Repite el PIN"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 fw-bold btn-kid-size fs-5 shadow-sm mb-2"
          :disabled="childStore.cargando || exitoRegistro"
        >
          <span v-if="childStore.cargando" class="spinner-border spinner-border-sm me-2"></span>
          {{ childStore.cargando ? 'Guardando...' : '🚀 Crear Perfil de Alumno' }}
        </button>

        <div class="text-center mt-2">
          <button
            type="button"
            @click="router.back()"
            class="btn btn-link text-decoration-none text-danger fw-bold btn-cancel-kid"
          >
            ❌ Cancelar y Volver
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChildStore } from '@/stores/childStore'

const router = useRouter()
const childStore = useChildStore()

// Objeto agrupado para mantener limpio el script
const formulario = ref({
  nombre: '',
  apellido: '',
  edad: null,
  nivel: '1',
  nombreusuario: '',
  password: '',
})

const confirmarPassword = ref('')
const errorLocal = ref('')
const exitoRegistro = ref(false)

// Limpiar mensajes del store al desmontar para no dejar basura visual
onUnmounted(() => {
  childStore.limpiarMensajes()
})

const procesarRegistro = async () => {
  errorLocal.value = ''
  childStore.limpiarMensajes()

  // Validación 1: Confirmación de contraseña
  if (formulario.value.password !== confirmarPassword.value) {
    errorLocal.value = 'Las contraseñas no coinciden. Revisa e intenta de nuevo.'
    return
  }

  // Validación 2: Edad coherente
  if (formulario.value.edad < 1 || formulario.value.edad > 15) {
    errorLocal.value = 'Por favor ingresa una edad válida para un niño.'
    return
  }

  // Construimos el objeto exacto que espera Dexie (db.js)
  const datosAlumno = {
    nombreusuario: formulario.value.nombreusuario.trim(),
    nombre: formulario.value.nombre.trim(),
    apellido: formulario.value.apellido.trim(),
    password: formulario.value.password.trim(),
    edad: Number(formulario.value.edad), // Casteo estricto a número
    nivel: Number(formulario.value.nivel), // Casteo estricto a número
    rol: 'child', // FUNDAMENTAL: Se fuerza el rol
    medallasCount: 0, // Inicia sin medallas
    fechaRegistro: new Date().toISOString(),
  }

  // Delegamos el guardado a Pinia
  const resultado = await childStore.registrarAlumno(datosAlumno)

  if (resultado) {
    exitoRegistro.value = true
    setTimeout(() => {
      // Regresa a la vista anterior (Dashboard)
      router.back()
    }, 1500)
  }
}
</script>

<style scoped>

/* Fondo con el mismo degradado del home */
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 50%, #f3e8ff 100%);
  position: relative;
  overflow: hidden;
}

/* Circulos decorativos de las esquinas */
.register-page::before,
.register-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}
.register-page::before {
  top: -5%;
  right: -10%;
  width: 450px;
  height: 450px;
  background: rgba(255, 193, 7, 0.15);
}
.register-page::after {
  bottom: -5%;
  left: -5%;
  width: 500px;
  height: 500px;
  background: rgba(244, 63, 94, 0.1);
}

.register-card {
  width: 100%;
  max-width: 520px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.95) 100%);
  backdrop-filter: blur(12px);
  border-width: 4px !important;
  border-style: solid !important;
  border-color: #ffffff !important;
  border-radius: 2.5rem !important;
  z-index: 10;
}

/* Estilos del titulo principal */
.kid-title {
  font-weight: 900;
  color: #0d6efd;
}

/* Inputs con bordes redondeados */
.kid-input {
  border: 2px solid #cbd5e1;
  border-radius: 1.2rem !important;
  padding: 0.6rem 1rem;
  transition: all 0.2s ease;
  font-weight: 500;
}
.kid-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.15) !important;
  outline: none;
}

/* Boton principal con el efecto hover del home */
.btn-kid-size {
  border-radius: 1.2rem;
  padding: 0.75rem;
  font-weight: 800 !important;
  transition:
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    filter 0.2s ease;
}
.btn-kid-size:hover {
  transform: scale(1.04) rotate(-0.5deg);
  filter: brightness(1.05);
}

.btn-cancel-kid {
  transition: transform 0.2s ease;
}
.btn-cancel-kid:hover {
  transform: scale(1.05);
}

/* Animacion de la estrella giratoria */
.kid-stars-decor {
  position: absolute;
  top: 25px;
  right: 30px;
  font-size: 1.5rem;
  animation: spinStar 4s linear infinite;
  user-select: none;
  color: #ffc107;
}

/* Elementos flotantes sueltos en el fondo */
.floating-bg-item {
  position: absolute;
  font-size: 2.5rem;
  opacity: 0.12;
  user-select: none;
  pointer-events: none;
  animation: floatBackground 6s ease-in-out infinite;
}
.item-1 {
  top: 10%;
  left: 6%;
  animation-delay: 0s;
}
.item-2 {
  bottom: 12%;
  left: 8%;
  animation-delay: 1.5s;
}
.item-3 {
  top: 15%;
  right: 8%;
  animation-delay: 3s;
}
.item-4 {
  bottom: 15%;
  right: 6%;
  animation-delay: 4.5s;
}

/* Animaciones */
@keyframes spinStar {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes floatBackground {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(10deg);
  }
}
</style>
