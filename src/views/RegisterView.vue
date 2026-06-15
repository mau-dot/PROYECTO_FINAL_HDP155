<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4 border-0 rounded-4" style="width: 100%; max-width: 450px;">
      
      <div class="text-center mb-4">
        <h2 class="fw-bold text-success">Crear Cuenta Admin</h2>
        <p class="text-muted">Regístrate como profesor o padre para gestionar el juego</p>
      </div>

      <div v-if="authStore.mensajeError" class="alert alert-danger text-center" role="alert">
        {{ authStore.mensajeError }}
      </div>

      <div v-if="exitoRegistro" class="alert alert-success text-center" role="alert">
        ¡Registro exitoso! Redirigiendo al login...
      </div>

      <form @submit.prevent="procesarRegistro">
        <div class="mb-3">
          <label for="fullName" class="form-label fw-bold">Nombre Completo</label>
          <input type="text" id="fullName" class="form-control" v-model="nombre" placeholder="Ej: Prof. Carlos Gómez" required />
        </div>

        <div class="mb-3">
          <label for="username" class="form-label fw-bold">Usuario de acceso</label>
          <input type="text" id="username" class="form-control" v-model="usuario" placeholder="Ej: carlos123" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-bold">Contraseña</label>
          <input type="password" id="password" class="form-control" v-model="password" placeholder="Mínimo 6 caracteres" required />
        </div>

        <div class="mb-4">
          <label for="confirmPassword" class="form-label fw-bold">Confirmar Contraseña</label>
          <input type="password" id="passwordConfirm" class="form-control" v-model="confirmarPassword" placeholder="Repite tu contraseña" required />
        </div>

        <button type="submit" class="btn btn-success w-100 fw-bold" :disabled="authStore.cargando">
          {{ authStore.cargando ? 'Procesando...' : 'Registrarse como Admin' }}
        </button>

        <div class="text-center mt-3">
          <router-link to="/login" class="text-decoration-none text-success fw-bold">
            ¿Ya tienes cuenta? Inicia sesión aquí
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const nombre = ref('');
const usuario = ref('');
const password = ref('');
const confirmarPassword = ref('');

const exitoRegistro = ref(false);

const procesarRegistro = async () => {
  authStore.mensajeError = ''; // Limpiamos errores previos

  if (password.value !== confirmarPassword.value) {
    authStore.mensajeError = 'Las contraseñas no coinciden.';
    return;
  }

  if (password.value.length < 6) {
    authStore.mensajeError = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  // Llamamos a authStore para crear el ADMIN
  const resultado = await authStore.registrarUsuario({
    nombre: nombre.value,
    usuario: usuario.value,
    password: password.value,
    rol: 'admin'
  });

  if (resultado) {
    exitoRegistro.value = true;
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 2000);
  }
};

// Limpiamos mensajes de error si el usuario se va a otra pantalla
onUnmounted(() => {
  authStore.mensajeError = '';
});
</script>