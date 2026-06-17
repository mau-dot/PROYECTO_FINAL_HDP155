<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import carefreeMp3 from '@/media/carefree.mp3'

const route = useRoute()
const audioRef = ref(null)
const isPlaying = ref(true)

const hideMusic = computed(() => !!route.meta.hideMusic)

function toggleMusic() {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play().catch(() => {})
    isPlaying.value = true
  }
}

onMounted(() => {
  // Try to autoplay; browsers may block autoplay with sound.
  if (audioRef.value) {
    audioRef.value.loop = true
    audioRef.value.autoplay = true
    audioRef.value.play().catch(() => {
      // If autoplay blocked, start paused and wait for user action
      isPlaying.value = false
    })
  }
})

// Pause music when navigating to a route that hides it
watch(
  () => route.fullPath,
  () => {
    if (!audioRef.value) return
    if (hideMusic.value) {
      audioRef.value.pause()
      isPlaying.value = false
    } else {
      // resume only if previously playing
      if (isPlaying.value) audioRef.value.play().catch(() => {})
    }
  },
)
</script>

<template>
  <div id="app">
    <RouterView />

    <audio ref="audioRef" style="display: none" :src="carefreeMp3"></audio>

    <button
      v-if="!hideMusic"
      @click="toggleMusic"
      style="
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        padding: 10px 14px;
        border-radius: 8px;
        background: #2d8cff;
        color: white;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      "
      aria-label="Toggle background music"
    >
      {{ isPlaying ? 'Apagar música' : 'Encender música' }}
    </button>
  </div>
</template>

<style scoped></style>
