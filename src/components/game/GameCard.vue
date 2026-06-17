<template>
  <div 
    class="card h-100 shadow-sm position-relative transition-all" 
    :class="{ 'opacity-50 border-secondary bg-light': isLocked, 'card-hover cursor-pointer': !isLocked }"
    @click="handleCardClick"
  >
    <div class="position-absolute top-0 end-0 m-2">
      <span v-if="isLocked" class="badge bg-secondary p-2 rounded-circle">
        <i class="bi bi-lock-fill fs-5"></i>
      </span>
      <span v-else-if="isCompleted" class="badge bg-success p-2 rounded-circle">
        <i class="bi bi-check-lg fs-5"></i>
      </span>
    </div>

    <img 
      :src="lesson.imagen || 'https://via.placeholder.com/150'" 
      class="card-img-top p-3 rounded" 
      alt="Lesson Image"
      style="max-height: 160px; object-fit: contain;"
    />

    <div class="card-body d-flex flex-column text-center">
      <h5 class="card-title fw-bold text-primary">{{ lesson.titulo }}</h5>
      <p class="card-text text-muted small flex-grow-1">
        {{ lesson.descripcion || '¡Vamos a aprender y divertirnos juntos!' }}
      </p>
      
      <button 
        class="btn w-100 fw-bold mt-2"
        :class="isLocked ? 'btn-secondary disabled' : (isCompleted ? 'btn-outline-success' : 'btn-warning text-white')"
        :disabled="isLocked"
      >
        <span v-if="isLocked">Bloqueado 🔒</span>
        <span v-else-if="isCompleted">¡Repetir! ⭐</span>
        <span v-else>¡Jugar! 🚀</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameCard",
  props: {
    lesson: {
      type: Object,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  emits: ["select-lesson"],
  methods: {
    handleCardClick() {
      if (!this.isLocked) {
        this.$emit("select-lesson", this.lesson.id);
      }
    },
  },
};
</script>

<style scoped>
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>