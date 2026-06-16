<script setup>
defineProps({
  usuarios: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['verProgreso', 'eliminarUsuario', 'editarUsuario'])
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
            <th scope="col" class="ps-4">Alumno</th>
            <th scope="col">Usuario (Nick)</th>
            <th scope="col">Edad</th>
            <th scope="col">Nivel</th>
            <th scope="col">Medallas</th>
            <th scope="col" style="width: 25%;">Progreso</th>
            <th scope="col" class="text-end pe-4">Acciones Administrativas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="usuarios.length === 0">
            <td colspan="7" class="text-center py-4 text-muted">
              No hay alumnos registrados en el sistema actualmente.
            </td>
          </tr>

          <tr v-for="user in usuarios" :key="user.id">
            <td class="fw-bold text-secondary ps-4">
               {{ user.nombre }}
            </td>
            <td>
              <span class="badge bg-light text-dark border">{{ user.nombreusuario }}</span>
            </td>
            <td>{{ user.edad }} años</td>
            <td>Nivel {{ user.nivel }}</td>
            <td>🏅 {{ user.medallasCount || 0 }}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="progress w-100" style="height: 12px;">
                  <div 
                    class="progress-bar bg-info" 
                    role="progressbar" 
                    :style="{ width: (user.progreso || 0) + '%' }"
                    :aria-valuenow="user.progreso || 0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <span class="fw-bold small text-muted">{{ user.progreso || 0 }}%</span>
              </div>
            </td>
            <td class="text-end pe-4">
              <div class="btn-group gap-1">
                <button 
                  @click="emit('editarUsuario', user)" 
                  class="btn btn-sm btn-outline-warning fw-bold"
                  title="Editar datos del alumno"
                >
                   ✏️ Editar
                </button>
                <button 
                  @click="emit('verProgreso', user)" 
                  class="btn btn-sm btn-outline-primary fw-bold"
                  title="Ver estadísticas detalladas"
                >
                   📊 Detalles
                </button>
                <button 
                  @click="emit('eliminarUsuario', user.id)" 
                  class="btn btn-sm btn-outline-danger fw-bold"
                  title="Dar de baja perfil de alumno"
                >
                   🗑️ Baja
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>