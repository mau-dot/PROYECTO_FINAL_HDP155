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
        <span class="badge rounded-pill bg-warning text-dark fw-bold px-3 py-2">Nivel 2</span>
      </div>

      <section class="hero-section p-4 p-lg-5 rounded-5 shadow-sm mb-5">
        <div class="row align-items-center gy-4">
          <div class="col-lg-7">
            <span class="badge rounded-pill bg-info-subtle text-info-emphasis px-3 py-2 mb-3">
              🦁 Aventureros Valientes
            </span>
            <h1 class="display-5 fw-bold mb-3 text-primary">🚀 ¡Pequeños Aventureros!</h1>
            <p class="lead text-secondary mb-4">
              Actividades pensadas para 3-4 años: letras, números y descubrimientos. Completa cada
              actividad para desbloquear la siguiente.
            </p>

            <div class="row row-cols-1 row-cols-sm-3 g-3">
              <div class="col">
                <div class="stat-card p-3 rounded-4 bg-white border shadow-sm h-100">
                  <span class="d-block text-uppercase text-muted small mb-2">Lecciones</span>
                  <strong class="fs-3">{{ allLessons.length }}</strong>
                </div>
              </div>
              <div class="col">
                <div class="stat-card p-3 rounded-4 bg-white border shadow-sm h-100">
                  <span class="d-block text-uppercase text-muted small mb-2">Completadas</span>
                  <strong class="fs-3">{{ completedLessonIds.length }}</strong>
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
                  <h2 class="h4 fw-bold mb-0">Actividades para 3-4 años</h2>
                </div>
                <span class="badge bg-success rounded-pill px-3 py-2">Jugar</span>
              </div>

              <p class="text-secondary mb-4">
                Ejercicios cortos y coloridos que fomentan la curiosidad y las primeras letras.
              </p>

              <div class="d-flex flex-column gap-3">
                <div class="menu-chip bg-warning-subtle border border-warning-subtle rounded-4 p-3">
                  <div class="fw-bold">Juegos de colores</div>
                  <div class="small text-secondary">
                    {{ leccionesOpcionMultiple.length }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-info-subtle border border-info-subtle rounded-4 p-3">
                  <div class="fw-bold">Palabras cortas</div>
                  <div class="small text-secondary">
                    {{ leccionesCompletar.length }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-success-subtle border border-success-subtle rounded-4 p-3">
                  <div class="fw-bold">Números básicos</div>
                  <div class="small text-secondary">
                    {{ leccionesMatematica.length }} disponible(s)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Cargando aventuras...</p>
      </div>

      <div v-else-if="allLessons.length === 0" class="text-center py-5">
        <p class="fs-4 text-muted">😴 Aún no hay lecciones para este nivel.</p>
        <p class="text-muted small">
          El administrador todavía no ha creado contenido para Nivel 2.
        </p>
      </div>

      <section v-else class="lesson-menu mb-5">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span class="badge rounded-pill bg-primary-subtle text-primary fw-bold px-3 py-2 mb-2">
              Menú de Aventuras
            </span>
            <h2 class="fw-bold mb-1">Misiones Disponibles</h2>
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
                    Supera el reto anterior para abrir esta misión
                  </div>

                  <button
                    class="btn btn-play w-100 btn-sm mt-auto"
                    :disabled="isLessonLocked(allLessons, index)"
                    @click="goToLesson(lesson.id)"
                  >
                    {{ isLessonCompleted(lesson.id) ? 'Volver a jugar' : '▶ ¡Iniciar Misión!' }}
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

<script>
import { database } from '@/database/db'

export default {
  name: 'Level2View',
  data() {
    return {
      allLessons: [],
      completedLessonIds: [],
      currentChildId: 1,
      cargando: true,
    }
  },
  computed: {
    leccionesOpcionMultiple() {
      return this.allLessons.filter((l) => l.tipo === 'opcion_multiple').sort((a, b) => a.id - b.id)
    },
    leccionesCompletar() {
      return this.allLessons
        .filter((l) => l.tipo === 'completar_oracion')
        .sort((a, b) => a.id - b.id)
    },
    leccionesMatematica() {
      return this.allLessons.filter((l) => l.tipo === 'matematica').sort((a, b) => a.id - b.id)
    },
  },
  async mounted() {
    await this.loadLevelData()
  },
  methods: {
    async loadLevelData() {
      try {
        this.cargando = true
        // Para asegurar una secuencia ordenada impecable, usamos sortBy('id')
        this.allLessons = await database.lecciones.where('nivel').equals(2).sortBy('id')

        const progressRecords = await database.progress
          .where('usuarioId')
          .equals(this.currentChildId)
          .toArray()
        this.completedLessonIds = progressRecords
          .filter((p) => p.esCompletado)
          .map((p) => p.leccionId)
      } catch (error) {
        console.error('Error cargando datos del nivel 2:', error)
      } finally {
        this.cargando = false
      }
    },
    isLessonCompleted(lessonId) {
      return this.completedLessonIds.includes(lessonId)
    },
    isLessonLocked(group, index) {
      if (index === 0) return false
      const previousLesson = group[index - 1]
      return !this.isLessonCompleted(previousLesson.id)
    },
    goToLesson(lessonId) {
      const lesson = this.allLessons.find((l) => l.id === lessonId)
      if (!lesson) return
      const routeMap = {
        opcion_multiple: 'play-multiple',
        completar_oracion: 'play-fill',
        matematica: 'play-math',
      }
      const routeName = routeMap[lesson.tipo] || 'play-multiple'
      this.$router.push({ name: routeName, params: { id: lessonId } })
    },
    lessonTypeLabel(tipo) {
      const labels = {
        opcion_multiple: 'Opción múltiple',
        completar_oracion: 'Completar oración',
        matematica: 'Matemática',
      }
      return labels[tipo] || 'Lección'
    },
    lessonBadgeClass(tipo) {
      const classes = {
        opcion_multiple: 'bg-warning-subtle text-warning border-warning-subtle',
        completar_oracion: 'bg-info-subtle text-info-emphasis border-info-subtle',
        matematica: 'bg-success-subtle text-success-emphasis border-success-subtle',
      }
      return classes[tipo] || 'bg-secondary text-dark'
    },
    getLessonEmoji(tipo) {
      const map = {
        opcion_multiple: '🧩',
        completar_oracion: '✍️',
        matematica: '➕',
      }
      return map[tipo] || '🎯'
    },
  },
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
