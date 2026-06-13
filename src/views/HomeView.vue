<template>
  <div class="home-page">
    <Navbar />

    <main>
      <section class="hero-section py-5 py-lg-6">
        <div class="container position-relative">
          <div class="row align-items-center g-4 g-lg-5">
            <div class="col-lg-6 text-center text-lg-start">
              <span class="badge rounded-pill bg-warning text-dark fw-bold px-3 py-2 mb-3"
                >EduKids</span
              >

              <h1 class="display-4 fw-bold text-primary-emphasis mb-3">
                Aprender jugando nunca fue tan divertido.
              </h1>

              <p class="lead text-secondary mb-4">
                Una aventura educativa para niños con retos, colores, formas y hábitos adaptados a
                cada edad.
              </p>

              <div
                class="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start align-items-center"
              >
                <BaseButton
                  texto="Empezar a jugar"
                  color="warning"
                  emoji="🚀"
                  size="lg"
                  @click="empezarJugar"
                />

                <BaseButton
                  texto="Ir al login"
                  color="primary"
                  emoji="🔐"
                  size="lg"
                  @click="irALogin"
                />

                <BaseButton
                  v-if="authStore.estaAutenticado && !authStore.esAdmin"
                  texto="Ir a mi nivel"
                  color="success"
                  emoji="🎮"
                  size="lg"
                  @click="irAMiNivel"
                />

                <BaseButton
                  v-if="authStore.esAdmin"
                  texto="Ir al panel admin"
                  color="dark"
                  emoji="🛠️"
                  size="lg"
                  @click="irAlDashboard"
                />
              </div>

              <div class="mt-3 small text-secondary">
                <strong>{{ saludoHero }}</strong>
              </div>
            </div>

            <div class="col-lg-6">
              <div class="hero-panel card border-0 shadow-lg">
                <div class="card-body p-4 p-md-5">
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <p class="text-uppercase text-muted fw-semibold mb-1">Ruta de aprendizaje</p>
                      <h2 class="h4 fw-bold mb-0">Cuatro niveles, cuatro etapas</h2>
                    </div>
                    <span class="badge bg-success rounded-pill px-3 py-2">Listo para jugar</span>
                  </div>

                  <div class="row g-3">
                    <div class="col-6">
                      <div
                        class="p-3 rounded-4 bg-warning-subtle border border-warning-subtle h-100"
                      >
                        <div class="fw-bold text-dark">Colores y hábitos</div>
                        <div class="small text-secondary">
                          Aprende los colores y rutinas diarias 🧼
                        </div>
                      </div>
                    </div>

                    <div class="col-6">
                      <div class="p-3 rounded-4 bg-info-subtle border border-info-subtle h-100">
                        <div class="fw-bold text-dark">Letras y números</div>
                        <div class="small text-secondary">
                          Descubre el abecedario y cuenta hasta 10 🔢
                        </div>
                      </div>
                    </div>

                    <div class="col-6">
                      <div
                        class="p-3 rounded-4 bg-success-subtle border border-success-subtle h-100"
                      >
                        <div class="fw-bold text-dark">Palabras y sumas</div>
                        <div class="small text-secondary">
                          Forma tus primeras palabras y sumas sencillas ⭐
                        </div>
                      </div>
                    </div>

                    <div class="col-6">
                      <div class="p-3 rounded-4 bg-danger-subtle border border-danger-subtle h-100">
                        <div class="fw-bold text-dark">Cuentos y lectura</div>
                        <div class="small text-secondary">
                          Practica lectura comprensiva y vocabulario 📚
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 p-3 rounded-4 bg-white border shadow-sm">
                    <div class="d-flex align-items-center justify-content-between">
                      <div>
                        <p class="text-muted mb-1 small">Descubre los juegos preparados para ti</p>
                        <p class="fw-bold mb-0">{{ mensajeProgreso }}</p>
                      </div>
                      <span class="level-chip">{{ nivelVisible }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5 bg-light">
        <div class="container">
          <div class="text-center mb-4 mb-lg-5">
            <span class="badge rounded-pill bg-primary-subtle text-primary fw-bold px-3 py-2 mb-3">
              Niveles de juego
            </span>
            <h2 class="fw-bold mb-2">Explora los 4 niveles de EduKids</h2>
            <p class="text-secondary mb-0">
              Cada nivel está pensado para una etapa distinta y refuerza habilidades sencillas de
              forma divertida.
            </p>
          </div>

          <div class="row g-4">
            <div v-for="nivel in niveles" :key="nivel.id" class="col-md-6 col-xl-3">
              <article class="card level-card h-100 border-0 shadow-sm">
                <div class="card-body d-flex flex-column p-4">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge rounded-pill px-3 py-2" :class="nivel.badgeClass">
                      {{ nivel.edades }}
                    </span>
                    <div class="d-flex align-items-center gap-2">
                      <span class="level-chip">{{ nivel.id }}</span>
                    </div>
                  </div>

                  <h3 class="h5 fw-bold mb-2">{{ nivel.nombre }}</h3>
                  <p class="text-primary fw-semibold mb-2">{{ nivel.titulo }}</p>
                  <p class="text-secondary mb-4">{{ nivel.descripcion }}</p>

                  <BaseButton
                    texto="Ver nivel"
                    color="info"
                    emoji=""
                    size="sm"
                    class="mt-auto"
                    @click="irALevel(nivel.ruta)"
                  />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

const niveles = [
  {
    id: 1,
    nombre: 'Nivel 1',
    edades: '1-2 años',
    titulo: 'Colores y hábitos',
    descripcion: 'Enfoque en colores y hábitos para los más pequeños.',
    ruta: 'level1',
    badgeClass: 'bg-info-subtle text-info-emphasis border border-info-subtle',
  },
  {
    id: 2,
    nombre: 'Nivel 2',
    edades: '3-4 años',
    titulo: 'Abecedario y números',
    descripcion: 'Enfoque en el abecedario y los números.',
    ruta: 'level2',
    badgeClass: 'bg-success-subtle text-success-emphasis border border-success-subtle',
  },
  {
    id: 3,
    nombre: 'Nivel 3',
    edades: '5-6 años',
    titulo: 'Formar palabras y matemáticas sencillas',
    descripcion: 'Enfoque en formar palabras y operaciones matemáticas sencillas.',
    ruta: 'level3',
    badgeClass: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
  },
  {
    id: 4,
    nombre: 'Nivel 4',
    edades: '7-8 años',
    titulo: 'Lectura',
    descripcion: 'Enfoque en la lectura para reforzar comprensión y vocabulario.',
    ruta: 'level4',
    badgeClass: 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
  },
]

const beneficios = [
  {
    label: 'A',
    titulo: 'Aprendizaje claro',
    descripcion:
      'Contenido corto, directo y pensado para que niños y padres entiendan el progreso con facilidad.',
    iconClass: 'bg-primary-subtle text-primary',
  },
  {
    label: 'B',
    titulo: 'Niveles por edad',
    descripcion:
      'Cada niño entra al nivel que le corresponde para evitar frustración y mantener la motivación.',
    iconClass: 'bg-success-subtle text-success',
  },
  {
    label: 'C',
    titulo: 'Diseño amigable',
    descripcion:
      'Colores suaves, botones grandes y una navegación simple para una experiencia segura y agradable.',
    iconClass: 'bg-warning-subtle text-warning',
  },
]

const nivelVisible = computed(() => {
  if (!authStore.estaAutenticado) {
    return 'Invitado'
  }

  if (authStore.esAdmin) {
    return 'Admin'
  }

  const nivel = Number(authStore.nivelUsuario)
  return Number.isInteger(nivel) && nivel >= 1 && nivel <= 4 ? `Nivel ${nivel}` : 'Sin nivel'
})

const mensajeProgreso = computed(() => {
  if (!authStore.estaAutenticado) {
    return 'Empieza desde el login para entrar como niño o como admin.'
  }

  if (authStore.esAdmin) {
    return 'Como admin puedes revisar el panel y administrar los perfiles.'
  }

  const nivel = Number(authStore.nivelUsuario)

  if (Number.isInteger(nivel) && nivel >= 1 && nivel <= 4) {
    return `Tu ruta asignada es el Nivel ${nivel}.`
  }

  return 'No encontramos un nivel válido para tu perfil.'
})

const saludoHero = computed(() => {
  if (!authStore.estaAutenticado) {
    return 'Si todavía no entraste, puedes comenzar desde el login.'
  }

  if (authStore.esAdmin) {
    return `Hola ${authStore.usuarioActual?.nombre ?? 'Administrador'}, entra al panel para gestionar el contenido.`
  }

  const nombre = authStore.usuarioActual?.nombre ?? 'pequeño explorador'
  const nivel = Number(authStore.nivelUsuario)

  if (Number.isInteger(nivel) && nivel >= 1 && nivel <= 4) {
    return `Hola ${nombre}, tu nivel asignado es el ${nivel}.`
  }

  return `Hola ${nombre}, revisaremos tu nivel asignado.`
})

const empezarJugar = () => {
  if (!authStore.estaAutenticado) {
    router.push({ name: 'login' })
    return
  }

  if (authStore.esAdmin) {
    router.push({ name: 'dashboard' })
    return
  }

  const nivel = Number(authStore.nivelUsuario)

  if (Number.isInteger(nivel) && nivel >= 1 && nivel <= 4) {
    router.push({ name: `level${nivel}` })
    return
  }

  router.push({ name: 'home' })
}

const irALogin = () => {
  router.push({ name: 'login' })
}

const irAMiNivel = () => {
  const nivel = Number(authStore.nivelUsuario)

  if (Number.isInteger(nivel) && nivel >= 1 && nivel <= 4) {
    router.push({ name: `level${nivel}` })
    return
  }

  router.push({ name: 'home' })
}

const irAlDashboard = () => {
  router.push({ name: 'dashboard' })
}

const irALevel = (rutaNivel) => {
  // 1. Si no está autenticado, mandarlo al login
  if (!authStore.estaAutenticado) {
    router.push({ name: 'login' })
    return
  }

  // 2. Si es admin, mandarlo al dashboard ya que no juega los niveles directos
  if (authStore.esAdmin) {
    router.push({ name: 'dashboard' })
    return
  }

  // 3. Si es un niño, extraer el número del nivel que intenta clickear (ej: 'level1' -> 1)
  const nivelObjetivo = Number(rutaNivel.replace('level', ''))
  const nivelUsuario = Number(authStore.nivelUsuario)

  // Si coincide con su nivel asignado, permitir el paso; si no, redirigir a su propio nivel
  if (nivelUsuario === nivelObjetivo) {
    router.push({ name: rutaNivel })
  } else {
    router.push({ name: `level${nivelUsuario}` })
  }
}

const verDetalleNivel = (rutaNivel) => {
  irALevel(rutaNivel)
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 38%, #fff8ef 100%);
}

.hero-section {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 193, 7, 0.24), transparent 30%),
    radial-gradient(circle at bottom right, rgba(13, 110, 253, 0.12), transparent 28%);
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: auto -8rem -10rem auto;
  width: 18rem;
  height: 18rem;
  background: rgba(13, 110, 253, 0.08);
  border-radius: 50%;
  filter: blur(10px);
}

.hero-panel {
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
}

.level-card {
  border-radius: 1.25rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.level-card:hover {
  transform: scale(1.04) rotate(1deg); /* Se agranda un poquito y se inclina de lado */
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Efecto rebote */
}

.level-chip {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.benefit-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.py-lg-6 {
  padding-top: 5rem;
  padding-bottom: 5rem;
}

@media (max-width: 991.98px) {
  .py-lg-6 {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
}
</style>
