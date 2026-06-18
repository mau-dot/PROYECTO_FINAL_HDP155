<template>
  <div class="gcard" :class="{ 'gcard--locked': isLocked }" @click="handleCardClick">
    <!-- ANIMACIÓN según tipo (sin imagen) -->
    <div class="gcard__anim" :class="animClass">
      <!-- Opción múltiple: burbujas + ícono bombilla -->
      <template v-if="lesson.tipo === 'opcion_multiple' && !isLocked">
        <div class="bubble b1"></div>
        <div class="bubble b2"></div>
        <div class="bubble b3"></div>
        <i class="ti ti-bulb main-icon icon-green" aria-hidden="true"></i>
      </template>

      <!-- Completar oración: estrellas + ícono puzzle -->
      <template v-else-if="lesson.tipo === 'completar_oracion' && !isLocked">
        <span class="star s1">✦</span>
        <span class="star s2">✦</span>
        <span class="star s3">✦</span>
        <i class="ti ti-puzzle main-icon icon-blue" aria-hidden="true"></i>
      </template>

      <!-- Matemática: números flotantes -->
      <template v-else-if="lesson.tipo === 'matematica' && !isLocked">
        <span class="num n1">3</span>
        <span class="num n2">+</span>
        <span class="num n3">5</span>
        <i class="ti ti-math-function main-icon icon-amber" aria-hidden="true"></i>
      </template>

      <!-- Bloqueada -->
      <template v-else>
        <i class="ti ti-lock lock-icon" aria-hidden="true"></i>
      </template>
    </div>

    <!-- CUERPO -->
    <div class="gcard__body">
      <span class="gcard__badge" :class="badgeClass">{{ tipoLabel }}</span>
      <p class="gcard__title">{{ lesson.titulo }}</p>
      <p class="gcard__desc">
        {{ lesson.descripcion || '¡Vamos a aprender y divertirnos juntos!' }}
      </p>

      <button class="gcard__btn" :class="btnClass" :disabled="isLocked">
        <span v-if="isLocked">Bloqueado 🔒</span>
        <span v-else-if="isCompleted">⭐ Repetir</span>
        <span v-else>Jugar</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',
  props: {
    lesson: { type: Object, required: true },
    isLocked: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
  },
  emits: ['select-lesson'],
  computed: {
    animClass() {
      if (this.isLocked) return 'anim--locked'
      const map = {
        opcion_multiple: 'anim--multiple',
        completar_oracion: 'anim--oracion',
        matematica: 'anim--mate',
      }
      return map[this.lesson.tipo] || 'anim--multiple'
    },
    badgeClass() {
      if (this.isLocked) return 'badge--locked'
      const map = {
        opcion_multiple: 'badge--multiple',
        completar_oracion: 'badge--oracion',
        matematica: 'badge--mate',
      }
      return map[this.lesson.tipo] || 'badge--multiple'
    },
    tipoLabel() {
      if (this.isLocked) return 'Bloqueado'
      const map = {
        opcion_multiple: 'Opción múltiple',
        completar_oracion: 'Completar oración',
        matematica: 'Matemática',
      }
      return map[this.lesson.tipo] || 'Lección'
    },
    btnClass() {
      if (this.isLocked) return 'btn--lock'
      if (this.isCompleted) return 'btn--done'
      return 'btn--play'
    },
  },
  methods: {
    handleCardClick() {
      if (!this.isLocked) this.$emit('select-lesson', this.lesson.id)
    },
  },
}
</script>

<style scoped>
.gcard {
  background: var(--color-background-primary, #fff);
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

/* ÁREA DE ANIMACIÓN */
.gcard__anim {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.anim--multiple {
  background: #eaf3de;
}
.anim--oracion {
  background: #e6f1fb;
}
.anim--mate {
  background: #faeeda;
}
.anim--locked {
  background: #f5f5f5;
}

/* Íconos principales */
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

/* Burbujas (opción múltiple) */
.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: float 3s ease-in-out infinite;
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

/* Estrellas (completar oración) */
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

/* Números (matemática) */
.num {
  position: absolute;
  font-size: 26px;
  font-weight: 500;
  color: #ba7517;
  animation: bounce 1.5s ease-in-out infinite;
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

/* CUERPO */
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
.badge--multiple {
  background: #eaf3de;
  color: #3b6d11;
}
.badge--oracion {
  background: #e6f1fb;
  color: #185fa5;
}
.badge--mate {
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

/* Animaciones */
@keyframes float {
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
@keyframes bounce {
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
</style>
