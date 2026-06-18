<template>
  <div class="level-page">
    <div class="container py-4">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <button
          class="btn btn-outline-secondary btn-sm fw-bold"
          @click="$router.push({ name: 'home' })"
        >
          ← Regresar al inicio
        </button>
        <span class="badge rounded-pill bg-warning text-dark fw-bold px-3 py-2">Nivel 3</span>
      </div>

      <section class="hero-section p-4 p-lg-5 rounded-5 shadow-sm mb-5">
        <div class="row align-items-center gy-4">
          <div class="col-lg-7">
            <span class="badge rounded-pill bg-info-subtle text-info-emphasis px-3 py-2 mb-3">
              📚 Pequeños Lectores
            </span>
            <h1 class="display-5 fw-bold mb-3 text-primary">📖 ¡Mundo de las Palabras!</h1>
            <p class="lead text-secondary mb-4">
              Actividades para 5-6 años: lectura, formación de palabras y operaciones sencillas.
              ¡Supera cada desafío para desbloquear el siguiente reto!
            </p>

            <div class="row row-cols-1 row-cols-sm-3 g-3">
              <div class="col">
                <div class="stat-card p-3 rounded-4 bg-white border shadow-sm h-100">
                  <span class="d-block text-uppercase text-muted small mb-2">Lecciones</span>
                  <strong class="fs-3">{{ allLessons?.length || 0 }}</strong>
                </div>
              </div>
              <div class="col">
                <div class="stat-card p-3 rounded-4 bg-white border shadow-sm h-100">
                  <span class="d-block text-uppercase text-muted small mb-2">Completadas</span>
                  <strong class="fs-3">{{ completedLessonIds?.length || 0 }}</strong>
                </div>
              </div>
              <div class="col">
                <div class="stat-card p-3 rounded-4 bg-white border shadow-sm h-100">
                  <span class="d-block text-uppercase text-muted small mb-2">Categorías</span>
                  <strong class="fs-3">3</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="hero-card p-4 rounded-4 bg-white border shadow-sm h-100">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <p class="text-uppercase text-muted fw-semibold mb-1">Menú de lecciones</p>
                  <h2 class="h4 fw-bold mb-0">Actividades para 5-6 años</h2>
                </div>
                <span class="badge bg-success rounded-pill px-3 py-2">Jugar</span>
              </div>

              <p class="text-secondary mb-4">
                Retos diseñados para mejorar lectura y operaciones básicas, con actividades
                interactivas.
              </p>

              <div class="d-flex flex-column gap-3">
                <div class="menu-chip bg-warning-subtle border border-warning-subtle rounded-4 p-3">
                  <div class="fw-bold">Vocabulario</div>
                  <div class="small text-secondary">
                    {{ leccionesOpcionMultiple?.length || 0 }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-info-subtle border border-info-subtle rounded-4 p-3">
                  <div class="fw-bold">Completar frases</div>
                  <div class="small text-secondary">
                    {{ leccionesCompletar?.length || 0 }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-success-subtle border border-success-subtle rounded-4 p-3">
                  <div class="fw-bold">Sumas sencillas</div>
                  <div class="small text-secondary">
                    {{ leccionesMatematica?.length || 0 }} disponible(s)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Cargando laboratorio de palabras...</p>
      </div>

      <div v-else-if="!allLessons || allLessons.length === 0" class="text-center py-5">
        <p class="fs-4 text-muted">😴 Aún no hay lecciones para este nivel.</p>
        <p class="text-muted small">
          El administrador todavía no ha creado contenido para Nivel 3.
        </p>
      </div>

      <section v-else class="lesson-menu mb-5">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span class="badge rounded-pill bg-primary-subtle text-primary fw-bold px-3 py-2 mb-2">
              Panel de Retos
            </span>
            <h2 class="fw-bold mb-1">Misiones Intelectuales</h2>
            <p class="text-secondary mb-0">Selecciona una tarjeta para iniciar cada actividad.</p>
          </div>
        </div>

        <div class="row g-4">
          <div
            v-for="(lesson, index) in allLessons"
            :key="lesson.id"
            class="col-12 col-md-6 col-xl-4"
          >
            <article
              class="card level-card h-100 border-0 shadow-sm lesson-card"
              :class="{ 'lesson-locked': isLessonLocked(allLessons, index) }"
              :style="isLessonLocked(allLessons, index) ? 'opacity: 0.65;' : ''"
            >
              <div class="card-body d-flex flex-column h-100">
                <div class="lesson-visual mb-3">
                  {{ isLessonLocked(allLessons, index) ? '🔒' : getLessonEmoji(lesson.tipo) }}
                </div>

                <div class="d-flex align-items-center justify-content-between mb-3">
                  <span class="badge rounded-pill px-3 py-2" :class="lessonBadgeClass(lesson.tipo)">
                    {{ lessonTypeLabel(lesson.tipo) }}
                  </span>
                  <span class="level-chip">{{ index + 1 }}</span>
                </div>

                <h3 class="h5 fw-bold mb-2">{{ lesson.titulo }}</h3>
                <p class="text-secondary mb-4">
                  {{ lesson.descripcion || 'Lección educativa divertida.' }}
                </p>

                <div class="mt-auto w-100">
                  <div
                    v-if="isLessonCompleted(lesson.id)"
                    class="text-success small fw-bold mb-2 text-center"
                  >
                    ✨ ¡Completada!
                  </div>
                  <div
                    v-else-if="isLessonLocked(allLessons, index)"
                    class="text-muted small fw-bold mb-2 text-center"
                  >
                    Completa la misión anterior para desbloquear
                  </div>

                  <button
                    class="btn btn-play w-100 btn-sm"
                    :disabled="isLessonLocked(allLessons, index)"
                    @click="goToLesson(lesson.id)"
                  >
                    {{
                      isLessonCompleted(lesson.id) ? 'Perfeccionar lección' : '🚀 ¡Empezar Desafío!'
                    }}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLeccionesStore } from '@/stores/leccionesStore'

const router = useRouter()
const leccionesStore = useLeccionesStore()

// Variables reactivas
const allLessons = ref([])
const completedLessonIds = ref([])
const cargando = ref(true)

// Filtros computados
const leccionesOpcionMultiple = computed(() => allLessons.value.filter((l) => l.tipo === 'opcion_multiple') || [])
const leccionesCompletar = computed(() => allLessons.value.filter((l) => l.tipo === 'completar_oracion') || [])
const leccionesMatematica = computed(() => allLessons.value.filter((l) => l.tipo === 'matematica') || [])

onMounted(async () => {
  await loadLevelData()
})

const loadLevelData = async () => {
  cargando.value = true
  try {
    // LLAMADO A PINIA CON EL NIVEL 3
    const lecciones = await leccionesStore.cargarLeccionesPorNivel(3)
    // Se ordenan por ID como lo tenían planteado originalmente
    allLessons.value = (lecciones || []).sort((a, b) => a.id - b.id)
  } catch (error) {
    console.error('Error cargando datos del nivel 3:', error)
    allLessons.value = []
  } finally {
    cargando.value = false
  }
}

// Funciones de estado
const isLessonCompleted = (lessonId) => {
  return completedLessonIds.value.includes(lessonId)
}

const isLessonLocked = (group, index) => {
  // Como acordamos, retornamos false para que todas estén desbloqueadas y puedas probar los juegos
  return false
}

const goToLesson = (lessonId) => {
  const lesson = allLessons.value.find((l) => l.id === lessonId)
  if (!lesson) return
  
  const routeMap = {
    opcion_multiple: 'play-multiple',
    completar_oracion: 'play-fill',
    matematica: 'play-math',
  }
  const routeName = routeMap[lesson.tipo] || 'play-multiple'
  router.push({ name: routeName, params: { id: lessonId } })
}

// Funciones de diseño visual (UI)
const lessonTypeLabel = (tipo) => {
  const labels = {
    opcion_multiple: 'Opción múltiple',
    completar_oracion: 'Completar oración',
    matematica: 'Matemática',
  }
  return labels[tipo] || 'Lección'
}

const lessonBadgeClass = (tipo) => {
  const classes = {
    opcion_multiple: 'bg-warning-subtle text-warning border-warning-subtle',
    completar_oracion: 'bg-info-subtle text-info-emphasis border-info-subtle',
    matematica: 'bg-success-subtle text-success-emphasis border-success-subtle',
  }
  return classes[tipo] || 'bg-secondary text-dark'
}

const getLessonEmoji = (tipo) => {
  const map = {
    opcion_multiple: '📚',
    completar_oracion: '✏️',
    matematica: '🔢',
  }
  return map[tipo] || '🎯'
}
</script>

<style scoped>
/* Contenedor principal con gradiente de mayor contraste */
.level-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 50%, #fae8ff 100%);
  position: relative;
  overflow: hidden;
}

/* --- DECORACIONES DE LETRAS Y NÚMEROS FLOTANTES (MÁS VISIBLES) --- */
.decoracion-letras-numeros {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.item-flotante {
  position: absolute;
  font-family: 'Comic Sans MS', 'Fredoka One', sans-serif;
  font-weight: 900;
  color: rgba(99, 102, 241, 0.15); /* Opacidad perfecta para que resalte sin estorbar */
  animation: flotar-item 6s ease-in-out infinite;
}

/* Posiciones estratégicas para que se distribuyan por toda la pantalla */
.pos-1 {
  top: 12%;
  left: 8%;
  font-size: 4rem;
  animation-delay: 0s;
}
.pos-2 {
  top: 8%;
  left: 45%;
  font-size: 3.5rem;
  animation-delay: 1.5s;
}
.pos-3 {
  top: 18%;
  right: 12%;
  font-size: 5rem;
  color: rgba(147, 51, 234, 0.13);
  animation-delay: 0.7s;
}
.pos-4 {
  top: 48%;
  left: 5%;
  font-size: 4.5rem;
  animation-delay: 2.2s;
}
.pos-5 {
  top: 55%;
  right: 6%;
  font-size: 3.8rem;
  color: rgba(219, 39, 119, 0.12);
  animation-delay: 1.1s;
}
.pos-6 {
  bottom: 15%;
  left: 15%;
  font-size: 4.8rem;
  animation-delay: 0.3s;
}
.pos-7 {
  bottom: 8%;
  left: 52%;
  font-size: 3.5rem;
  animation-delay: 2.8s;
}
.pos-8 {
  bottom: 18%;
  right: 15%;
  font-size: 5.5rem;
  color: rgba(147, 51, 234, 0.15);
  animation-delay: 1.9s;
}

@keyframes flotar-item {
  0%,
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-20px) rotate(15deg) scale(1.08);
  }
}

/* --- ESFERAS DE LAS ESQUINAS --- */
.level-page::before,
.level-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.level-page::before {
  top: -4rem;
  right: -4rem;
  width: 24rem;
  height: 24rem;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.4) 0%, rgba(147, 51, 234, 0.25) 100%);
  animation: float-advanced 8s ease-in-out infinite;
  box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.4);
}

.level-page::after {
  bottom: -5rem;
  left: -5rem;
  width: 26rem;
  height: 26rem;
  background: radial-gradient(circle, rgba(192, 132, 252, 0.35) 0%, rgba(99, 102, 241, 0.2) 100%);
  animation: float-advanced 10s ease-in-out infinite reverse;
  box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.3);
}

/* --- HERO SECTION --- */
.hero-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 60%, #f5f3ff 100%);
  border: 3px solid rgba(129, 140, 248, 0.35);
  box-shadow: 0 20px 50px rgba(129, 140, 248, 0.15);
  position: relative;
  z-index: 1;
}

.hero-section h1 {
  color: #4f46e5;
  font-size: 2.8rem;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);
  animation: brain-bounce 3s ease-in-out infinite;
}

.hero-card,
.stat-card,
.lesson-card {
  position: relative;
  z-index: 1;
}

.hero-card {
  min-height: 280px;
  background: #ffffff;
}

.stat-card {
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  background: #ffffff;
  color: #0f172a;
  border-color: rgba(129, 140, 248, 0.25);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(129, 140, 248, 0.18);
}

/* Bloques laterales del submenú */
.menu-chip {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  color: #0f172a;
}

.menu-chip:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(129, 140, 248, 0.15);
}

.menu-chip.bg-warning-subtle {
  background-color: rgba(245, 158, 11, 0.22) !important;
}
.menu-chip.bg-info-subtle {
  background-color: rgba(99, 102, 241, 0.18) !important;
}
.menu-chip.bg-success-subtle {
  background-color: rgba(16, 185, 129, 0.2) !important;
}

/* Tarjetas de Lección */
.level-card {
  border-radius: 1.5rem;
  transition:
    transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 250ms ease;
  border: 2px solid rgba(129, 140, 248, 0.2);
  background: #ffffff;
}

.lesson-card:not(.lesson-locked):hover {
  transform: translateY(-10px) scale(1.03) translateX(2px);
  box-shadow: 0 25px 45px rgba(129, 140, 248, 0.22);
}

.lesson-visual {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  font-size: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.25), rgba(192, 132, 252, 0.15));
  box-shadow: 0 10px 25px rgba(129, 140, 248, 0.15);
  animation: rapid-slide 3.5s ease-in-out infinite;
}

.level-chip {
  width: 2.4rem;
  height: 2.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(129, 140, 248, 0.22);
  color: #4338ca;
  font-weight: 700;
}

/* Botón de Lanzamiento */
.btn-play {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border: none;
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
}

.btn-play:not(:disabled):hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
}

/* Clases de soporte contextual */
.badge.bg-primary-subtle {
  background-color: rgba(129, 140, 248, 0.2) !important;
  color: #4338ca !important;
}
.badge.bg-warning-subtle {
  background-color: rgba(245, 158, 11, 0.18) !important;
  color: #9a3412 !important;
}
.badge.bg-info-subtle {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #1e40af !important;
}
.badge.bg-success-subtle {
  background-color: rgba(16, 185, 129, 0.18) !important;
  color: #065f46 !important;
}

.border-warning-subtle {
  border-color: rgba(245, 158, 11, 0.3) !important;
}
.border-info-subtle {
  border-color: rgba(129, 140, 248, 0.3) !important;
}
.border-success-subtle {
  border-color: rgba(16, 185, 129, 0.3) !important;
}

/* Controladores de Animación */
@keyframes float-advanced {
  0%,
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) scale(1.03) rotate(5deg);
  }
}

@keyframes brain-bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.01);
  }
}

@keyframes rapid-slide {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.06) rotate(4deg);
  }
}

@media (max-width: 767.98px) {
  .hero-section {
    padding: 2rem !important;
  }
}
</style>
