<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    
    <div class="card shadow p-4 border-0 rounded-4" style="width: 100%; max-width: 450px;">
      
      <div class="text-center mb-4">
        <h2 class="fw-bold text-success">Crear Cuenta Admin</h2>
        <p class="text-muted">Regístrate como profesor o padre para gestionar el juego</p>
      </div>

      <div v-if="errorRegistro" class="alert alert-danger text-center" role="alert">
        {{ mensajeError }}
      </div>

      <div v-if="exitoRegistro" class="alert alert-success text-center" role="alert">
        ¡Registro exitoso! Redirigiendo al login...
      </div>

      <form @submit.prevent="procesarRegistro">
        
        <div class="mb-3">
          <label for="fullName" class="form-label fw-bold">Nombre Completo</label>
          <input 
            type="text" 
            id="fullName" 
            class="form-control" 
            v-model="nombre" 
            placeholder="Ej: Prof. Carlos Gómez" 
            required 
          />
        </div>

        <div class="mb-3">
          <label for="username" class="form-label fw-bold">Usuario de acceso</label>
          <input 
            type="text" 
            id="username" 
            class="form-control" 
            v-model="usuario" 
            placeholder="Ej: carlos123" 
            required 
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-bold">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            class="form-control" 
            v-model="password" 
            placeholder="Mínimo 6 caracteres" 
            required 
          />
        </div>

        <div class="mb-4">
          <label for="confirmPassword" class="form-label fw-bold">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="passwordConfirm" 
            class="form-control" 
            v-model="confirmarPassword" 
            placeholder="Repite tu contraseña" 
            required 
          />
        </div>

        <button type="submit" class="btn btn-success w-100 fw-bold" :disabled="cargando">
          {{ cargando ? 'Procesando...' : 'Registrarse como Admin' }}
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const nombre = ref('');
const usuario = ref('');
const password = ref('');
const confirmarPassword = ref('');

const errorRegistro = ref(false);
const mensajeError = ref('');
const exitoRegistro = ref(false);
const cargando = ref(false);

const procesarRegistro = async () => {
  errorRegistro.value = false;
  exitoRegistro.value = false;

  if (password.value !== confirmarPassword.value) {
    errorRegistro.value = true;
    mensajeError.value = 'Las contraseñas no coinciden.';
    return;
  }

  if (password.value.length < 6) {
    errorRegistro.value = true;
    mensajeError.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  cargando.value = true;

  try {
    // Al registrar, el objeto se envía al store para que Dexie lo guarde en IndexedDB junto con la contraseña
    const resultado = await authStore.registrarUsuario({
      nombre: nombre.value,
      usuario: usuario.value,
      password: password.value, // <--- Se guarda aquí
      rol: 'admin'
    });

    if (resultado) {
      exitoRegistro.value = true;
      setTimeout(() => {
        router.push({ name: 'login' });
      }, 2000);
    } else {
      errorRegistro.value = true;
      mensajeError.value = 'El nombre de usuario ya está registrado.';
    }
  } catch (error) {
    errorRegistro.value = true;
    mensajeError.value = 'Error al conectar con la base de datos.';
  } finally {
    cargando.value = false;
  }
};
</script>