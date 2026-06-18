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
              🧸 Exploradores de Colores
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
                  <!-- Blindaje con ? y || 0 -->
                  <strong class="fs-3">{{ allLessons?.length || 0 }}</strong>
                </div>
              </div>
              <div class="col">
                <div class="stat-card p-3 rounded-4 bg-white border shadow-sm h-100">
                  <span class="d-block text-uppercase text-muted small mb-2">Completadas</span>
                  <!-- Blindaje con ? y || 0 -->
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
                    <!-- Blindaje con ? y || 0 -->
                    {{ leccionesOpcionMultiple?.length || 0 }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-info-subtle border border-info-subtle rounded-4 p-3">
                  <div class="fw-bold">Completar oración</div>
                  <div class="small text-secondary">
                    <!-- Blindaje con ? y || 0 -->
                    {{ leccionesCompletar?.length || 0 }} disponible(s)
                  </div>
                </div>
                <div class="menu-chip bg-success-subtle border border-success-subtle rounded-4 p-3">
                  <div class="fw-bold">Matemática</div>
                  <div class="small text-secondary">
                    <!-- Blindaje con ? y || 0 -->
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
          El administrador todavía no ha creado contenido para Nivel 1.
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
            <!-- REEMPLAZO: Cambié goToLesson(lesson.id) por irAJugar(lesson) -->
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
import { useRouter } from 'vue-router'
import { database } from '@/database/db'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// ===== VARIABLES =====
const allLessons = ref([])
const cargando = ref(true)
const completedLessonIds = ref([])

// ===== COMPUTED =====
const leccionesOpcionMultiple = computed(() =>
  allLessons.value.filter(l => l.tipo === 'opcion_multiple')
)
const leccionesCompletar = computed(() =>
  allLessons.value.filter(l => l.tipo === 'completar_oracion')
)
const leccionesMatematica = computed(() =>
  allLessons.value.filter(l => l.tipo === 'matematica')
)

// ===== CARGAR DATOS =====
onMounted(async () => {
  await inicializarNivel()
})

const inicializarNivel = async () => {
  cargando.value = true
  try {
    // 1. Cargar lecciones del nivel 1 directo de Dexie
    allLessons.value = await database.lecciones
      .where('nivel')
      .equals(1)
      .toArray()

    // 2. Cargar progreso del niño en sesión
    const usuarioId = authStore.usuarioActual?.id
    if (usuarioId) {
      const progressRecords = await database.progress
        .where('usuarioId')
        .equals(usuarioId)
        .toArray()

      // ✅ Solo completada si tuvo 0 errores (100% aciertos)
      completedLessonIds.value = progressRecords
        .filter(p => p.esCompletado && p.errores === 0)
        .map(p => p.leccionId)
    }
  } catch (error) {
    console.error('Error al cargar lecciones:', error)
    allLessons.value = []
  } finally {
    cargando.value = false
  }
}

// ===== LÓGICA DE BLOQUEO =====
const isLessonCompleted = (lessonId) => {
  return completedLessonIds.value.includes(lessonId)
}

const isLessonLocked = (lessons, index) => {
  // Primera lección siempre desbloqueada
  if (index === 0) return false
  // Las demás requieren que la anterior esté completada al 100%
  const leccionAnterior = lessons[index - 1]
  return !isLessonCompleted(leccionAnterior.id)
}

// ===== ETIQUETAS =====
const lessonTypeLabel = (tipo) => {
  const map = {
    opcion_multiple:   'Opción múltiple',
    completar_oracion: 'Completar oración',
    matematica:        'Matemática'
  }
  return map[tipo] || 'Actividad'
}

// ===== NAVEGACIÓN =====
const irAJugar = (leccion) => {
  if (!leccion?.tipo) return

  const routeMap = {
    opcion_multiple:   'play-multiple',
    completar_oracion: 'play-fill',
    matematica:        'play-math'
  }

  const routeName = routeMap[leccion.tipo]
  if (routeName) {
    router.push({ name: routeName, params: { id: leccion.id } })
  }
}
</script>

<style scoped>
/* --- ESTILOS DE LA PÁGINA (PASTEL FLOTANTE) --- */
.level-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeeff 0%, #fff4d6 50%, #ffe0e8 100%);
  position: relative;
  overflow: hidden;
}

.level-page::before,
.level-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
  animation: float 6s ease-in-out infinite;
}

.level-page::before {
  top: -3rem;
  right: -3rem;
  width: 20rem;
  height: 20rem;
  background: rgba(255, 193, 7, 0.28);
}

.level-page::after {
  bottom: -3rem;
  left: -6rem;
  width: 22rem;
  height: 22rem;
  background: rgba(255, 87, 34, 0.22);
}

.hero-section {
  background: linear-gradient(135deg, #ffffff 0%, #fff9e6 50%, #ffe8e1 100%);
  border: 3px solid rgba(255, 152, 0, 0.25);
  box-shadow: 0 20px 50px rgba(255, 152, 0, 0.12);
  position: relative;
  z-index: 1;
}

.hero-section h1 {
  color: #ff6f00;
  font-size: 2.8rem;
  animation: jiggle 2s ease-in-out infinite;
}

.hero-card,
.stat-card {
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
  border-color: rgba(13, 110, 253, 0.14);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 30px rgba(13, 110, 253, 0.1);
}

.menu-chip {
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  color: #0f172a;
}
.menu-chip:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(13, 110, 253, 0.1);
}
.menu-chip.bg-warning-subtle {
  background-color: rgba(255, 193, 7, 0.25) !important;
}
.menu-chip.bg-info-subtle {
  background-color: rgba(13, 110, 253, 0.18) !important;
}
.menu-chip.bg-success-subtle {
  background-color: rgba(25, 135, 84, 0.18) !important;
}

.badge.bg-primary-subtle {
  background-color: rgba(13, 110, 253, 0.18) !important;
  color: #0d6efd !important;
}
.badge.bg-warning-subtle {
  background-color: rgba(255, 193, 7, 0.22) !important;
  color: #b45309 !important;
}
.badge.bg-info-subtle {
  background-color: rgba(13, 110, 253, 0.18) !important;
  color: #0d6efd !important;
}
.badge.bg-success-subtle {
  background-color: rgba(25, 135, 84, 0.2) !important;
  color: #0f5132 !important;
}

.border-warning-subtle {
  border-color: rgba(255, 193, 7, 0.3) !important;
}
.border-info-subtle {
  border-color: rgba(13, 110, 253, 0.28) !important;
}
.border-success-subtle {
  border-color: rgba(25, 135, 84, 0.28) !important;
}

/* --- ESTILOS RESTAURADOS DE LAS GAMECARDS --- */
.gcard {
  background: #ffffff;
  border: 0.5px solid #e0e0e0;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  height: 100%;
}
.gcard:hover:not(.gcard--locked) {
  transform: translateY(-5px);
}
.gcard--locked {
  opacity: 0.55;
  cursor: not-allowed;
}

.gcard__anim {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.anim--opcion_multiple {
  background: #eaf3de;
}
.anim--completar_oracion {
  background: #e6f1fb;
}
.anim--matematica {
  background: #faeeda;
}
.anim--locked {
  background: #f5f5f5;
}

.main-icon {
  font-size: 54px;
  z-index: 2;
  position: relative;
  animation: pop 2s ease-in-out infinite;
}
.icon-green {
  color: #3b6d11;
}
.icon-blue {
  color: #185fa5;
}
.icon-amber {
  color: #854f0b;
}
.lock-icon {
  font-size: 38px;
  color: #aaa;
  opacity: 0.5;
}

/* Burbujas */
.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: floatCard 3s ease-in-out infinite;
}
.b1 {
  width: 40px;
  height: 40px;
  background: #639922;
  top: 10px;
  left: 15px;
  animation-delay: 0s;
}
.b2 {
  width: 25px;
  height: 25px;
  background: #97c459;
  top: 65px;
  left: 60px;
  animation-delay: 0.8s;
}
.b3 {
  width: 30px;
  height: 30px;
  background: #3b6d11;
  top: 18px;
  right: 20px;
  animation-delay: 1.4s;
}

/* Estrellas */
.star {
  position: absolute;
  opacity: 0.45;
  animation: twinkle 2s ease-in-out infinite;
  font-size: 20px;
  color: #185fa5;
}
.s1 {
  top: 12px;
  left: 22px;
  animation-delay: 0s;
}
.s2 {
  top: 55px;
  left: 58px;
  animation-delay: 0.6s;
}
.s3 {
  top: 15px;
  right: 26px;
  animation-delay: 1.2s;
}

/* Números */
.num {
  position: absolute;
  font-size: 26px;
  font-weight: 500;
  color: #ba7517;
  animation: bounceCard 1.5s ease-in-out infinite;
}
.n1 {
  top: 18px;
  left: 22px;
  animation-delay: 0s;
}
.n2 {
  top: 60px;
  left: 65px;
  animation-delay: 0.5s;
}
.n3 {
  top: 18px;
  right: 28px;
  animation-delay: 1s;
}

.gcard__body {
  padding: 12px 14px 16px;
}
.gcard__badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 9px;
  border-radius: 999px;
  margin-bottom: 7px;
}
.badge--opcion_multiple {
  background: #eaf3de;
  color: #3b6d11;
}
.badge--completar_oracion {
  background: #e6f1fb;
  color: #185fa5;
}
.badge--matematica {
  background: #faeeda;
  color: #854f0b;
}
.badge--locked {
  background: #f0f0f0;
  color: #999;
}

.gcard__title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
  line-height: 1.4;
  color: #222;
}
.gcard__desc {
  font-size: 12px;
  color: #888;
  margin: 0 0 12px;
  line-height: 1.5;
}
.gcard__btn {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.btn--play {
  background: #639922;
  color: #eaf3de;
}
.btn--done {
  background: #e6f1fb;
  color: #185fa5;
  border: 0.5px solid #185fa5;
}
.btn--lock {
  background: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
}

/* --- CORE KEYFRAMES --- */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
@keyframes jiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(2deg);
  }
  75% {
    transform: rotate(-2deg);
  }
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
@keyframes floatCard {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-9px);
  }
}
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3);
  }
}
@keyframes bounceCard {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}
@keyframes pop {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 767.98px) {
  .hero-section {
    padding: 2rem !important;
  }
}
</style>
