<script setup>
import { ref } from 'vue'

// Simulación local del tema que luego conectarás a Pinia
const modoOscuro = ref(false)

const toggleTema = () => {
  modoOscuro.value = !modoOscuro.value
  console.log(`Modo oscuro activo: ${modoOscuro.value}`)
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow px-3">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center fw-bold text-warning fs-3" href="#">
        🎈 <span class="ms-2 text-white">HDP Learn</span>
      </a>

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContenido">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContenido">
        <ul class="navbar-nav ms-auto align-items-center gap-2 mt-2 mt-lg-0">
          <li class="nav-item">
            <a class="nav-link text-white fw-bold px-3" href="#">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white fw-bold px-3" href="#">Mis Juegos</a>
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