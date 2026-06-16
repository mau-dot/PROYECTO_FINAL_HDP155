<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 py-5">
    <div class="card shadow-lg p-4 border-0 rounded-4" style="width: 100%; max-width: 550px;">
      
      <div class="text-center mb-4">
        <h2 class="fw-bold text-primary">🧒 Registrar Nuevo Alumno</h2>
        <p class="text-muted">Crea un perfil para que el niño acceda a sus minijuegos</p>
      </div>

      <div v-if="childStore.mensajeError" class="alert alert-danger text-center fw-bold shadow-sm" role="alert">
        {{ childStore.mensajeError }}
      </div>
      <div v-if="errorLocal" class="alert alert-warning text-center fw-bold shadow-sm" role="alert">
        {{ errorLocal }}
      </div>
      <div v-if="exitoRegistro" class="alert alert-success text-center fw-bold shadow-sm" role="alert">
        ¡Alumno registrado exitosamente! Volviendo al panel...
      </div>

      <form @submit.prevent="procesarRegistro">
        
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label fw-bold text-secondary small">Nombre(s)</label>
            <input type="text" class="form-control" v-model="formulario.nombre" placeholder="Ej: Juanito" required />
          </div>
          <div class="col-6">
            <label class="form-label fw-bold text-secondary small">Apellido(s)</label>
            <input type="text" class="form-control" v-model="formulario.apellido" placeholder="Ej: Pérez" required />
          </div>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label fw-bold text-secondary small">Edad (años)</label>
            <input type="number" class="form-control" v-model="formulario.edad" min="1" max="12" placeholder="Ej: 4" required />
          </div>
          <div class="col-6">
            <label class="form-label fw-bold text-secondary small">Nivel Educativo Inicial</label>
            <select v-model="formulario.nivel" class="form-select" required>
              <option value="1">Nivel 1 (1-2 años)</option>
              <option value="2">Nivel 2 (3-4 años)</option>
              <option value="3">Nivel 3 (5-6 años)</option>
              <option value="4">Nivel 4 (7-8 años)</option>
            </select>
          </div>
        </div>

        <hr class="my-4">

        <div class="mb-3">
          <label class="form-label fw-bold text-secondary small">Usuario de acceso (Nickname)</label>
          <input type="text" class="form-control" v-model="formulario.nombreusuario" placeholder="Ej: juanito_p" required />
          <div class="form-text">Sin espacios. Solo letras, números y guión bajo (_).</div>
        </div>

        <div class="row g-2 mb-4">
          <div class="col-6">
            <label class="form-label fw-bold text-secondary small">Contraseña / PIN</label>
            <input type="password" class="form-control" v-model="formulario.password" placeholder="Mínimo 4 caracteres" required />
          </div>
          <div class="col-6">
            <label class="form-label fw-bold text-secondary small">Confirmar PIN</label>
            <input type="password" class="form-control" v-model="confirmarPassword" placeholder="Repite el PIN" required />
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 fw-bold fs-5 shadow-sm" :disabled="childStore.cargando || exitoRegistro">
          <span v-if="childStore.cargando" class="spinner-border spinner-border-sm me-2"></span>
          {{ childStore.cargando ? 'Guardando...' : '🚀 Crear Perfil de Alumno' }}
        </button>

        <div class="text-center mt-3">
          <button type="button" @click="router.back()" class="btn btn-link text-decoration-none text-danger fw-bold">
            ❌ Cancelar y Volver
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useChildStore } from '@/stores/childStore';

const router = useRouter();
const childStore = useChildStore();

// Objeto agrupado para mantener limpio el script
const formulario = ref({
  nombre: '',
  apellido: '',
  edad: null,
  nivel: '1',
  nombreusuario: '',
  password: ''
});

const confirmarPassword = ref('');
const errorLocal = ref('');
const exitoRegistro = ref(false);

// Limpiar mensajes del store al desmontar para no dejar basura visual
onUnmounted(() => {
  childStore.limpiarMensajes();
});

const procesarRegistro = async () => {
  errorLocal.value = '';
  childStore.limpiarMensajes();

  // Validación 1: Confirmación de contraseña
  if (formulario.value.password !== confirmarPassword.value) {
    errorLocal.value = 'Las contraseñas no coinciden. Revisa e intenta de nuevo.';
    return;
  }

  // Validación 2: Edad coherente
  if (formulario.value.edad < 1 || formulario.value.edad > 15) {
    errorLocal.value = 'Por favor ingresa una edad válida para un niño.';
    return;
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
    fechaRegistro: new Date().toISOString()
  };

  // Delegamos el guardado a Pinia
  const resultado = await childStore.registrarAlumno(datosAlumno);

  if (resultado) {
    exitoRegistro.value = true;
    setTimeout(() => {
      // Regresa a la vista anterior (Dashboard)
      router.back(); 
    }, 1500);
  }
};
</script>