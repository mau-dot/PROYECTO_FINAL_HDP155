<template>
  <div class="login-page d-flex justify-content-center align-items-center vh-100">

    <div class="floating-bg-item item-1">🚀</div>
    <div class="floating-bg-item item-2">🎨</div>
    <div class="floating-bg-item item-3">🧩</div>
    <div class="floating-bg-item item-4">📐</div>

    <div class="card login-card shadow-lg p-4 p-md-5 border-0 rounded-5">

      <div class="kid-stars-decor">✨</div>

      <div class="text-center mb-4">
        <div class="avatar-container mb-2">
          <img :src="imagenLoginUrl" alt="Login" class="giant-avatar-img" />
        </div>
        <h2 class="kid-title h3 mb-1">¡Bienvenido!</h2>
        <p class="text-secondary fw-semibold">Ingresa tus datos para continuar</p>
      </div>

      <div v-if="authStore.mensajeError" class="alert alert-danger text-center rounded-4 fw-bold" role="alert">
        {{ authStore.mensajeError }}
      </div>

      <form @submit.prevent="procesarLogin">

        <div class="mb-3">
          <label for="username" class="form-label fw-bold text-secondary">Usuario</label>
          <input
            type="text"
            id="username"
            class="form-control kid-input"
            v-model="usuario"
            placeholder="Ej: admin o juanito"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="form-label fw-bold text-secondary">Contraseña o PIN</label>
          <input
            type="password"
            id="password"
            class="form-control kid-input"
            v-model="password"
            placeholder="****"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100 fw-bold btn-kid-size" :disabled="authStore.cargando">
          {{ authStore.cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>

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

/* Url de la imagen exacta de la captura */
const imagenLoginUrl = ref('https://cdn-icons-png.flaticon.com/512/3059/3059518.png');

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

<style scoped>
/* Fondo con el mismo degradado del home */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 50%, #f3e8ff 100%);
  position: relative;
  overflow: hidden;
}

/* Circulos decorativos de las esquinas */
.login-page::before,
.login-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}
.login-page::before {
  top: -10%;
  right: -5%;
  width: 400px;
  height: 400px;
  background: rgba(255, 193, 7, 0.18);
}
.login-page::after {
  bottom: 5%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: rgba(244, 63, 94, 0.12);
}

/* Tarjeta estilo kid space panel */
.login-card {
  width: 100%;
  max-width: 400px;
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

/* Animacion de la imagen saltando */
.avatar-container {
  display: inline-block;
}
.giant-avatar-img {
  display: inline-block;
  width: 75px;
  height: 75px;
  object-fit: contain;
  animation: kidJump 2s ease-in-out infinite;
}

/* Inputs con bordes redondeados */
.kid-input {
  border: 2px solid #cbd5e1;
  border-radius: 1rem;
  padding: 0.6rem 1rem;
  transition: all 0.2s ease;
}
.kid-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.15) !important;
  outline: none;
}

/* Boton principal con el efecto hover del home */
.btn-kid-size {
  border-radius: 1rem;
  padding: 0.7rem;
  font-weight: 800 !important;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.2s ease;
}
.btn-kid-size:hover {
  transform: scale(1.06) rotate(-1deg);
  filter: brightness(1.1);
}

/* Animacion de la estrella giratoria */
.kid-stars-decor {
  position: absolute;
  top: 20px;
  right: 25px;
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
.item-1 { top: 15%; left: 8%; animation-delay: 0s; }
.item-2 { bottom: 15%; left: 12%; animation-delay: 1.5s; }
.item-3 { top: 18%; right: 10%; animation-delay: 3s; }
.item-4 { bottom: 18%; right: 8%; animation-delay: 4.5s; }

/* Animaciones compartidas */
@keyframes kidJump {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  30% {
    transform: translateY(-12px) scale(1.05) rotate(5deg);
  }
  60% {
    transform: translateY(0) scale(0.95) rotate(-5deg);
  }
}

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
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(10deg); }
}
</style>
