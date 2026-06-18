<template>
  <div class="level-page">
    <div class="container py-4">
      <div class="mb-3">
        <button
          class="btn btn-outline-secondary btn-sm fw-bold"
          @click="$router.push({ name: 'home' })"
        >
          ← Regresar al inicio
        </button>
      </div>

      <section class="hero-section p-4 p-lg-5 rounded-5 shadow-sm mb-5">
        <div class="row align-items-center gy-4">
          <div class="col-lg-7">
            <span class="badge rounded-pill bg-info-subtle text-info-emphasis px-3 py-2 mb-3">
              🚀 Pequeños Genios (Nivel 2)
            </span>
            <h1 class="display-5 fw-bold mb-3 text-primary">🎨 ¡Mi Mundo de Aprendizaje!</h1>
            <p class="lead text-secondary mb-4">
              Explora tus lecciones creadas y continúa tu camino de juego. Completa cada actividad
              para desbloquear la siguiente.
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
                  <h2 class="h4 fw-bold mb-0">Tus lecciones creadas</h2>
                </div>
                <span class="badge bg-success rounded-pill px-3 py-2">Jugar</span>
              </div>
              <p class="text-secondary mb-4">
                Selecciona una lección para continuar. Si el contenido no aparece, significa que el
                administrador aún no ha creado material para este nivel.
              </p>
              <div class="d-flex flex-column gap-3">
                <div class="menu-chip bg-warning-subtle border border-warning-subtle rounded-4 p-3">
                  <div class="fw-bold">Opción múltiple</div>
                  <div class="small text-secondary">
                    {{ leccionesOpcionMultiple?.length || 0 }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-info-subtle border border-info-subtle rounded-4 p-3">
                  <div class="fw-bold">Completar oración</div>
                  <div class="small text-secondary">
                    {{ leccionesCompletar?.length || 0 }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-success-subtle border border-success-subtle rounded-4 p-3">
                  <div class="fw-bold">Matemática</div>
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
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-2 text-muted">Cargando lecciones...</p>
      </div>

      <div v-else-if="!allLessons || allLessons.length === 0" class="text-center py-5">
        <p class="fs-4 text-muted">😴 Aún no hay lecciones para este nivel.</p>
        <p class="text-muted small">
          El administrador todavía no ha creado contenido para Nivel 2.
        </p>
      </div>

      <section v-else class="lesson-menu mb-5">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span class="badge rounded-pill bg-primary-subtle text-primary fw-bold px-3 py-2 mb-2">
              Menú de Actividades
            </span>
            <h2 class="fw-bold mb-1">Lecciones creadas</h2>
            <p class="text-secondary mb-0">Selecciona una tarjeta para iniciar cada actividad.</p>
          </div>
        </div>

        <div class="row g-4">
          <div
            v-for="(lesson, index) in allLessons"
            :key="lesson.id"
            class="col-12 col-md-6 col-xl-4"
          >
            <div
              class="gcard"
              :class="{ 'gcard--locked': isLessonLocked(allLessons, index) }"
              @click="!isLessonLocked(allLessons, index) && irAJugar(lesson)"
            >
              <div
                class="gcard__anim"
                :class="isLessonLocked(allLessons, index) ? 'anim--locked' : 'anim--' + lesson.tipo"
              >
                <template
                  v-if="lesson.tipo === 'opcion_multiple' && !isLessonLocked(allLessons, index)"
                >
                  <div class="bubble b1"></div>
                  <div class="bubble b2"></div>
                  <div class="bubble b3"></div>
                  <i class="ti ti-bulb main-icon icon-green" aria-hidden="true"></i>
                </template>

                <template
                  v-else-if="
                    lesson.tipo === 'completar_oracion' && !isLessonLocked(allLessons, index)
                  "
                >
                  <span class="star s1">✦</span>
                  <span class="star s2">✦</span>
                  <span class="star s3">✦</span>
                  <i class="ti ti-puzzle main-icon icon-blue" aria-hidden="true"></i>
                </template>

                <template
                  v-else-if="lesson.tipo === 'matematica' && !isLessonLocked(allLessons, index)"
                >
                  <span class="num n1">3</span>
                  <span class="num n2">+</span>
                  <span class="num n3">5</span>
                  <i class="ti ti-math-function main-icon icon-amber" aria-hidden="true"></i>
                </template>

                <template v-else>
                  <i class="ti ti-lock lock-icon" aria-hidden="true"></i>
                </template>
              </div>

              <div class="gcard__body">
                <span
                  class="gcard__badge"
                  :class="
                    isLessonLocked(allLessons, index) ? 'badge--locked' : 'badge--' + lesson.tipo
                  "
                >
                  {{
                    isLessonLocked(allLessons, index) ? 'Bloqueado' : lessonTypeLabel(lesson.tipo)
                  }}
                </span>
                <p class="gcard__title">{{ lesson.titulo }}</p>
                <p class="gcard__desc">
                  {{ lesson.descripcion || '¡Vamos a aprender y divertirnos juntos!' }}
                </p>

                <button
                  class="gcard__btn"
                  :class="
                    isLessonLocked(allLessons, index)
                      ? 'btn--lock'
                      : isLessonCompleted(lesson.id)
                        ? 'btn--done'
                        : 'btn--play'
                  "
                  :disabled="isLessonLocked(allLessons, index)"
                >
                  <span v-if="isLessonLocked(allLessons, index)">Bloqueado 🔒</span>
                  <span v-else-if="isLessonCompleted(lesson.id)">⭐ Repetir</span>
                  <span v-else>Jugar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue' 
import { useLeccionesStore } from '@/stores/leccionesStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const leccionesStore = useLeccionesStore()

// Variables reactivas principales
const allLessons = ref([])
const cargando = ref(true)

const completedLessonIds = ref([]) 

// Filtros calculados para los chips de la derecha
const leccionesOpcionMultiple = computed(() => allLessons.value.filter(l => l.tipo === 'opcion_multiple') || [])
const leccionesCompletar = computed(() => allLessons.value.filter(l => l.tipo === 'completar_oracion') || [])
const leccionesMatematica = computed(() => allLessons.value.filter(l => l.tipo === 'matematica') || [])

onMounted(async () => {
  await inicializarNivel()
})

const inicializarNivel = async () => {
  cargando.value = true
  try {
    // AQUI ESTA LA MAGIA: Pasamos el parámetro 2 para que traiga las de Nivel 2
    const lecciones = await leccionesStore.cargarLeccionesPorNivel(2)
    allLessons.value = lecciones || []
  } catch (error) {
    console.error("Error al cargar lecciones:", error)
    allLessons.value = []
  } finally {
    cargando.value = false
  }
}

const isLessonLocked = (lessons, index) => {
  return false
}

const isLessonCompleted = (id) => {
  return completedLessonIds.value.includes(id)
}

const lessonTypeLabel = (tipo) => {
  if (tipo === 'opcion_multiple') return 'Opción Múltiple'
  if (tipo === 'completar_oracion') return 'Completar Oración'
  if (tipo === 'matematica') return 'Matemáticas'
  return 'Actividad'
}

// Función principal para navegar
const irAJugar = (leccion) => {
  if (!leccion || !leccion.tipo) return

  if (leccion.tipo === 'opcion_multiple') {
    router.push({ name: 'play-multiple', params: { id: leccion.id } })
  } else if (leccion.tipo === 'matematica') {
    router.push({ name: 'play-math', params: { id: leccion.id } })
  } else if (leccion.tipo === 'completar_oracion') {
    router.push({ name: 'play-fill', params: { id: leccion.id } })
  }
}
</script>

<style scoped>
/* Base de la página con transiciones suaves y fondos lúdicos pero refinados */
.level-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f8f5 0%, #fef5e7 50%, #eef2f7 100%);
  position: relative;
  overflow: hidden;
}

/* Efectos flotantes decorativos circulares alineados a la estética premium */
.level-page::before,
.level-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.level-page::before {
  top: -3rem;
  right: -3rem;
  width: 20rem;
  height: 20rem;
  background: rgba(26, 188, 156, 0.22);
  animation: float-slow 7s ease-in-out infinite;
}

.level-page::after {
  bottom: -3rem;
  left: -6rem;
  width: 22rem;
  height: 22rem;
  background: rgba(243, 156, 18, 0.18);
  animation: float-slow 9s ease-in-out infinite reverse;
}

/* Diseño de Contenedor Principal (Hero Section) */
.hero-section {
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #fffbeb 100%);
  border: 3px solid rgba(26, 188, 156, 0.2);
  box-shadow: 0 20px 50px rgba(26, 188, 156, 0.12);
  position: relative;
  z-index: 1;
}

.hero-section h1 {
  color: #16a34a;
  font-size: 2.8rem;
  animation: jiggle-slow 2.5s ease-in-out infinite;
}

/* Tarjetas Informativas y Elementos de Estado */
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
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background: #ffffff;
  color: #0f172a;
  border-color: rgba(26, 188, 156, 0.15);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 30px rgba(26, 188, 156, 0.12);
}

/* Configuración de Fichas del Menú Lateral */
.menu-chip {
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  color: #0f172a;
}

.menu-chip:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(26, 188, 156, 0.1);
}

.menu-chip.bg-warning-subtle {
  background-color: rgba(234, 179, 8, 0.25) !important;
}
.menu-chip.bg-info-subtle {
  background-color: rgba(59, 130, 246, 0.18) !important;
}
.menu-chip.bg-success-subtle {
  background-color: rgba(34, 197, 94, 0.22) !important;
}

/* Arquitectura y Animación de Tarjetas de Lección */
.level-card {
  border-radius: 1.5rem;
  transition:
    transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 220ms ease;
  border: 2px solid rgba(26, 188, 156, 0.1);
  background: #ffffff;
}

.lesson-card:not(.lesson-locked):hover {
  transform: translateY(-12px) scale(1.03) rotate(0.5deg);
  box-shadow: 0 25px 50px rgba(26, 188, 156, 0.18);
}

/* Indicador Visual / Círculo de Emojis */
.lesson-visual {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  font-size: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(26, 188, 156, 0.2), rgba(234, 179, 8, 0.1));
  box-shadow: 0 10px 25px rgba(26, 188, 156, 0.15);
  animation: bounce-slow 2.2s ease-in-out infinite;
}

.level-chip {
  width: 2.4rem;
  height: 2.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(26, 188, 156, 0.22);
  color: #0f766e;
  font-weight: 700;
}

/* Estilización Avanzada de Botones de Control */
.btn-play {
  background: linear-gradient(90deg, #16a34a, #22c55e);
  border: none;
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  transition:
    transform 220ms ease,
    box-shadow 220ms ease;
}

.btn-play:not(:disabled):hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.35);
}

/* Badges de soporte contextual */
.badge.bg-primary-subtle {
  background-color: rgba(26, 188, 156, 0.18) !important;
  color: #0f766e !important;
}
.badge.bg-warning-subtle {
  background-color: rgba(234, 179, 8, 0.22) !important;
  color: #b45309 !important;
}
.badge.bg-info-subtle {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #1d4ed8 !important;
}
.badge.bg-success-subtle {
  background-color: rgba(34, 197, 94, 0.18) !important;
  color: #14532d !important;
}

.border-warning-subtle {
  border-color: rgba(234, 179, 8, 0.3) !important;
}
.border-info-subtle {
  border-color: rgba(59, 130, 246, 0.28) !important;
}
.border-success-subtle {
  border-color: rgba(34, 197, 94, 0.28) !important;
}

/* Controladores de Animaciones por Keyframes */
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.02);
  }
}

@keyframes jiggle-slow {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(1deg);
  }
  75% {
    transform: rotate(-1deg);
  }
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 767.98px) {
  .hero-section {
    padding: 2rem !important;
  }
}
</style>
