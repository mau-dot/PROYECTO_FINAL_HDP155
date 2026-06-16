<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router' 
import { useAuthStore } from '@/stores/auth'


const authStore = useAuthStore();
const router = useRouter();

//funcion de serrar sesion 
const cerrarSesion = ()=>{

  authStore.cerrarSesion();
  router.push({name : 'login'});  
};

// Simulación local del tema que luego conectarás a Pinia
const modoOscuro = ref(false)

const toggleTema = () => {
  modoOscuro.value = !modoOscuro.value
  console.log(`Modo oscuro activo: ${modoOscuro.value}`)
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow px-3 fixed-top">
    <div class="container-fluid">
      <RouterLink class="navbar-brand d-flex align-items-center fw-bold text-warning fs-3" href="#">
        🎈 <span class="ms-2 text-white">HDP Learn</span>
      </RouterLink>

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContenido">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContenido">
        <ul class="navbar-nav ms-auto align-items-center gap-2 mt-2 mt-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link text-white fw-bold px-3" href="#">Inicio</RouterLink>
          </li>
          <li class="nav-item" v-if="authStore.esChild">
            <RouterLink to="/juego/nivel-1" class="nav-link text-white fw-bold px-3" href="#">Mis Juegos</RouterLink>
          </li>

          <!--Mostrando usuario logeado, solo si esta autenticado-->
          <li v-if="authStore.estaAutenticado" class="nav-item">
            <RouterLink to="/perfil"  class="nav-link text-white fw-bold px-3" >
              👤 {{ authStore.usuarioActual?.nombre || authStore.usuarioActual?.nombreusuario }}
            </RouterLink>
          </li>
          <!--Boton de cierre de sesion-->
          <li v-if="authStore.estaAutenticado" class="nav-item">
            <button @click="cerrarSesion" class="btn btn-outline-light btn-sm fw-bold">
              Cerrar sesion
            </button>
          </li>

          <li class="nav-item ms-lg-3">
            <button @click="toggleTema" class="btn btn-warning rounded-circle p-2 fs-5 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;" title="Cambiar color del sitio">
              {{ modoOscuro ? '☀️' : '🌙' }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>