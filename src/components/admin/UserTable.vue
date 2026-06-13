<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  // Array de estudiantes que pasará la vista padre
  usuarios: {
    type: Array,
    required: true
    // Estructura esperada: [{ id: 1, nombre: 'Luisito', edad: 4, progreso: 60 }]
  }
})

const emit = defineEmits(['verProgreso', 'eliminarUsuario'])
</script>

<template>
  <div class="card shadow-sm border-0 rounded-3 my-3">
    <div class="card-header bg-dark text-white fw-bold py-3">
      👥 Control de Alumnos y Progreso General
    </div>
    
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle mb-0 bg-white">
        <thead class="table-dark">
          <tr>
            <th scope="col" class="ps-4">Nombre del Alumno</th>
            <th scope="col">Edad</th>
            <th scope="col" style="width: 35%;">Progreso del Nivel</th>
            <th scope="col" class="text-end pe-4">Acciones Administrativas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="usuarios.length === 0">
            <td colspan="4" class="text-center py-4 text-muted">
              No hay alumnos registrados en el sistema actualmente.
            </td>
          </tr>

          <tr v-for="user in usuarios" :key="user.id">
            <td class="fw-bold text-secondary ps-4">
               {{ user.nombre }}
            </td>
            <td>{{ user.edad }} años</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="progress w-100" style="height: 12px;">
                  <div 
                    class="progress-bar bg-info" 
                    role="progressbar" 
                    :style="{ width: user.progreso + '%' }"
                    :aria-valuenow="user.progreso"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <span class="fw-bold small text-muted">{{ user.progreso }}%</span>
              </div>
            </td>
            <td class="text-end pe-4">
              <div class="btn-group gap-1">
                <button 
                  @click="emit('verProgreso', user)" 
                  class="btn btn-sm btn-outline-primary fw-bold"
                  title="Ver estadísticas detalladas"
                >
                   Detalles
                </button>
                <button 
                  @click="emit('eliminarUsuario', user.id)" 
                  class="btn btn-sm btn-outline-danger fw-bold"
                  title="Dar de baja perfil de alumno"
                >
                   Dar de Baja
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>