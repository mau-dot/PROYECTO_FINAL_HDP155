<template>
  <div class="container py-4">
    <div class="text-center mb-5 bg-light p-4 rounded-3 shadow-sm border-0 position-relative header-kids">
      <h1 class="display-5 fw-bold text-warning mb-2">🎈 ¡Mi Mundo de Aprendizaje! 🎈</h1>
      <p class="fs-5 text-secondary m-0">Nivel Exploradores (1 - 2 años)</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted">Cargando lecciones...</p>
    </div>

    <!-- Sin lecciones -->
    <div v-else-if="allLessons.length === 0" class="text-center py-5">
      <p class="fs-4 text-muted">😴 Aún no hay lecciones para este nivel.</p>
      <p class="text-muted small">El administrador todavía no ha creado contenido para Nivel 1.</p>
    </div>

    <template v-else>
      <!-- Tema 1: Opción múltiple / colores -->
      <div v-if="leccionesOpcionMultiple.length > 0" class="mb-5">
        <h3 class="text-primary fw-bold mb-3 d-flex align-items-center">
          <span class="fs-2 me-2">🎨</span> Lecciones de Opción Múltiple
        </h3>
        <div class="row g-4">
          <div
            v-for="(lesson, index) in leccionesOpcionMultiple"
            :key="lesson.id"
            class="col-12 col-md-6"
          >
            <GameCard
              :lesson="lesson"
              :is-locked="isLessonLocked(leccionesOpcionMultiple, index)"
              :is-completed="isLessonCompleted(lesson.id)"
              @select-lesson="goToLesson"
            />
          </div>
        </div>
      </div>

      <hr v-if="leccionesOpcionMultiple.length > 0 && leccionesCompletar.length > 0" class="my-5 opacity-25" />

      <!-- Tema 2: Completar oración -->
      <div v-if="leccionesCompletar.length > 0" class="mb-5">
        <h3 class="text-success fw-bold mb-3 d-flex align-items-center">
          <span class="fs-2 me-2">🧩</span> Lecciones de Completar Oración
        </h3>
        <div class="row g-4">
          <div
            v-for="(lesson, index) in leccionesCompletar"
            :key="lesson.id"
            class="col-12 col-md-6"
          >
            <GameCard
              :lesson="lesson"
              :is-locked="isLessonLocked(leccionesCompletar, index)"
              :is-completed="isLessonCompleted(lesson.id)"
              @select-lesson="goToLesson"
            />
          </div>
        </div>
      </div>

      <hr v-if="leccionesCompletar.length > 0 && leccionesMatematica.length > 0" class="my-5 opacity-25" />

      <!-- Tema 3: Matemática -->
      <div v-if="leccionesMatematica.length > 0">
        <h3 class="text-warning fw-bold mb-3 d-flex align-items-center">
          <span class="fs-2 me-2">➕</span> Lecciones de Matemática
        </h3>
        <div class="row g-4">
          <div
            v-for="(lesson, index) in leccionesMatematica"
            :key="lesson.id"
            class="col-12 col-md-6"
          >
            <GameCard
              :lesson="lesson"
              :is-locked="isLessonLocked(leccionesMatematica, index)"
              :is-completed="isLessonCompleted(lesson.id)"
              @select-lesson="goToLesson"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import GameCard from "@/components/game/GameCard.vue";
import { database } from "@/database/db"; // ✅ nombre correcto

export default {
  name: "Level1View",
  components: { GameCard },
  data() {
    return {
      allLessons: [],
      completedLessonIds: [],
      currentChildId: 1, // 🔁 reemplazar con el ID del niño en sesión
      cargando: true,
    };
  },
  computed: {
    // Agrupa por tipo, igual a como lo guarda LessonForm
    leccionesOpcionMultiple() {
      return this.allLessons.filter(l => l.tipo === 'opcion_multiple').sort((a, b) => a.id - b.id);
    },
    leccionesCompletar() {
      return this.allLessons.filter(l => l.tipo === 'completar_oracion').sort((a, b) => a.id - b.id);
    },
    leccionesMatematica() {
      return this.allLessons.filter(l => l.tipo === 'matematica').sort((a, b) => a.id - b.id);
    }
  },
  async mounted() {
    await this.loadLevelData();
  },
  methods: {
    async loadLevelData() {
      try {
        this.cargando = true;

        // ✅ Tabla: 'lecciones' | campo nivel guarda número (1, 2, 3, 4)
        this.allLessons = await database.lecciones
          .where('nivel')
          .equals(1) // número, no string
          .toArray();

        // ✅ Campo correcto: 'usuarioId' según tu db.js
        const progressRecords = await database.progress
          .where('usuarioId')
          .equals(this.currentChildId)
          .toArray();

        this.completedLessonIds = progressRecords
          .filter(p => p.esCompletado)
          .map(p => p.leccionId);

      } catch (error) {
        console.error("Error cargando datos del nivel:", error);
      } finally {
        this.cargando = false;
      }
    },
    isLessonCompleted(lessonId) {
      return this.completedLessonIds.includes(lessonId);
    },
    // Recibe el array del grupo (ej: leccionesOpcionMultiple) e índice
    isLessonLocked(group, index) {
      if (index === 0) return false;
      const previousLesson = group[index - 1];
      return !this.isLessonCompleted(previousLesson.id);
    },
    goToLesson(lessonId) {
      this.$router.push({ name: 'PlayLesson', params: { id: lessonId } });
    }
  }
};
</script>

<style scoped>
.header-kids {
  border-bottom: 5px solid #ffca28 !important;
  border-radius: 20px !important;
}
</style>