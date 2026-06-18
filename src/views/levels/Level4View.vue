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
        <span class="badge rounded-pill bg-warning text-dark fw-bold px-3 py-2">Nivel 4</span>
      </div>

      <section class="hero-section p-4 p-lg-5 rounded-5 shadow-sm mb-5">
        <div class="row align-items-center gy-4">
          <div class="col-lg-7">
            <span class="badge rounded-pill bg-info-subtle text-info-emphasis px-3 py-2 mb-3"
              >🏆 Expertos en Aprendizaje</span
            >
            <h1 class="display-5 fw-bold mb-3 text-primary">🧠 ¡Exploradores Expertos!</h1>
            <p class="lead text-secondary mb-4">
              Retos para 7-8 años: lectura avanzada, comprensión y ejercicios para consolidar
              habilidades.
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
                  <h2 class="h4 fw-bold mb-0">Actividades para 7-8 años</h2>
                </div>
                <span class="badge bg-success rounded-pill px-3 py-2">Jugar</span>
              </div>

              <p class="text-secondary mb-4">
                Actividades que fomentan análisis, lectura comprensiva y resolución de problemas.
              </p>

              <div class="d-flex flex-column gap-3">
                <div class="menu-chip bg-warning-subtle border border-warning-subtle rounded-4 p-3">
                  <div class="fw-bold">Comprensión lectora</div>
                  <div class="small text-secondary">
                    {{ leccionesOpcionMultiple.length }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-info-subtle border border-info-subtle rounded-4 p-3">
                  <div class="fw-bold">Redacción y vocabulario</div>
                  <div class="small text-secondary">
                    {{ leccionesCompletar.length }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-success-subtle border border-success-subtle rounded-4 p-3">
                  <div class="fw-bold">Operaciones y lógica</div>
                  <div class="small text-secondary">
                    {{ leccionesMatematica.length }} disponible(s)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="allLessons.length === 0" class="text-center py-5">
        <p class="fs-4 text-muted">😴 Aún no hay lecciones para este nivel.</p>
        <p class="text-muted small">
          El administrador todavía no ha creado contenido para Nivel 4.
        </p>
      </section>

      <section v-else class="row g-4">
        <div
          v-for="(lesson, index) in allLessons"
          :key="lesson.id"
          class="col-12 col-md-6 col-xl-4"
        >
          <article class="card level-card h-100 border-0 shadow-sm lesson-card">
            <div class="card-body d-flex flex-column h-100">
              <div class="lesson-visual mb-3">{{ getLessonEmoji(lesson.tipo) }}</div>
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="badge rounded-pill px-3 py-2" :class="lessonBadgeClass(lesson.tipo)">{{
                  lessonTypeLabel(lesson.tipo)
                }}</span>
                <span class="level-chip">{{ index + 1 }}</span>
              </div>
              <h3 class="h5 fw-bold mb-2">{{ lesson.titulo }}</h3>
              <p class="text-secondary mb-4">
                {{ lesson.descripcion || 'Lección educativa divertida.' }}
              </p>
              <button
                class="btn btn-primary btn-sm mt-auto btn-play"
                @click="goToLesson(lesson.id)"
              >
                ▶ Ir a lección
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { database } from '@/database/db'

export default {
  name: 'Level4View',
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
        this.allLessons = await database.lecciones.where('nivel').equals(4).toArray()
        const progressRecords = await database.progress
          .where('usuarioId')
          .equals(this.currentChildId)
          .toArray()
        this.completedLessonIds = progressRecords
          .filter((p) => p.esCompletado)
          .map((p) => p.leccionId)
      } catch (error) {
        console.error('Error cargando datos del nivel 4:', error)
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
        opcion_multiple: '🧠',
        completar_oracion: '📝',
        matematica: '📐',
      }
      return map[tipo] || '🎯'
    },
  },
}
</script>

<style scoped>
/* Tones más maduros para Level 4 */
.level-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f3ff 0%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
}
.level-page::before {
  top: -3rem;
  right: -3rem;
  width: 20rem;
  height: 20rem;
  background: rgba(99, 102, 241, 0.16);
  position: absolute;
  border-radius: 50%;
}
.level-page::after {
  bottom: -3rem;
  left: -6rem;
  width: 22rem;
  height: 22rem;
  background: rgba(15, 23, 42, 0.08);
  position: absolute;
  border-radius: 50%;
}
.hero-section {
  background: linear-gradient(135deg, #fff 0%, #f3f4f6 40%, #f9fafb 100%);
  border: 2px solid rgba(99, 102, 241, 0.15);
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.1);
}
.hero-section h1 {
  color: #6366f1;
  font-weight: 900;
  letter-spacing: -1px;
}
.menu-chip.bg-warning-subtle {
  background-color: rgba(249, 115, 22, 0.18) !important;
}
.menu-chip.bg-info-subtle {
  background-color: rgba(99, 102, 241, 0.2) !important;
}
.menu-chip.bg-success-subtle {
  background-color: rgba(59, 130, 246, 0.18) !important;
}
.level-card {
  border-radius: 1.5rem;
  transition: all 300ms cubic-bezier(0.2, 0, 0.38, 0.9);
  border: 1px solid rgba(99, 102, 241, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95));
}
.lesson-card:hover {
  transform: translateY(-14px);
  box-shadow: 0 25px 60px rgba(99, 102, 241, 0.18);
  border-color: rgba(99, 102, 241, 0.2);
}
.level-chip {
  background: rgba(99, 102, 241, 0.12);
  color: #3730a3;
  font-weight: 700;
  font-size: 0.85rem;
}
.lesson-visual {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  font-size: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(59, 130, 246, 0.08));
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.12);
  animation: rise-up 3s ease-in-out infinite;
}
.btn-play {
  background: linear-gradient(90deg, #6366f1, #3b82f6);
  border: none;
  color: #fff;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.btn-play:hover {
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 12px 35px rgba(99, 102, 241, 0.35);
}

@keyframes rise-up {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}
</style>
