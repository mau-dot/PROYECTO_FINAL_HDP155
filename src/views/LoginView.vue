<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    
    <div class="card shadow p-4 border-0 rounded-4" style="width: 100%; max-width: 400px;">
      
      <div class="text-center mb-4">
        <h2 class="fw-bold text-primary">¡Bienvenido!</h2>
        <p class="text-muted">Ingresa tus datos para continuar</p>
      </div>

      <div v-if="authStore.mensajeError" class="alert alert-danger text-center" role="alert">
        {{ authStore.mensajeError }}
      </div>

      <form @submit.prevent="procesarLogin">
        
        <div class="mb-3">
          <label for="username" class="form-label fw-bold">Usuario</label>
          <input 
            type="text" 
            id="username" 
            class="form-control" 
            v-model="usuario" 
            placeholder="Ej: admin o juanito" 
            required 
          />
        </div>

        <div class="mb-4">
          <label for="password" class="form-label fw-bold">Contraseña o PIN</label>
          <input 
            type="password" 
            id="password" 
            class="form-control" 
            v-model="password" 
            placeholder="****" 
            required 
          />
        </div>

        <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="authStore.cargando">
          {{ useAuthStore.cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <!--Esto sera privado-->
        <!-- <div class="text-center mt-3">
          <router-link to="/register" class="text-decoration-none text-primary fw-bold">
            ¿Eres profesor/padre? Regístrate aquí
          </router-link>
        </div> -->

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

const usuario = ref('');
const password = ref('');


const procesarLogin = async () => {
  

  // Se envían los datos ingresados al store para que los busque y compare en IndexedDB
  const exito = await authStore.iniciarSesion(usuario.value, password.value);

  if (exito) {
    if (authStore.esAdmin) {
      router.push({ name: 'dashboard' });
    } else {
      router.push({ name: `level${authStore.nivelUsuario}` });
    }
  } else {
    
    password.value = '';
  }
};
</script>