// stores/adminStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { database } from '@/database/db'
import { useAuthStore } from '@/stores/auth' // Para actualizar la sesion si cambia sus datos

export const useAdminStore = defineStore('admin', () => {
  const cargando = ref(false)
  const mensajeError = ref('')
  const mensajeExito = ref('')

  // Actualizar el perfil del administrador
  const actualizarPerfilAdmin = async (idAdmin, datosNuevos) => {
    mensajeError.value = ''
    mensajeExito.value = ''
    cargando.value = true

    try {
      // 1. Validar nombre de usuario unico (si lo está cambiando)
      const nombreLimpio = datosNuevos.usuario.trim().toLowerCase()
      const usuarioExistente = await database.usuarios.get({ nombreusuario: nombreLimpio })
      
      if (usuarioExistente && usuarioExistente.id !== idAdmin) {
        mensajeError.value = 'El nombre de usuario ya está en uso por otra persona.'
        return false
      }

      // 2. Validar contraseña (opcional: solo si escribe una nueva)
      let datosAActualizar = {
        nombre: datosNuevos.nombre.trim(),
        nombreusuario: nombreLimpio
      }

      if (datosNuevos.password && datosNuevos.password.trim() !== '') {
        if (datosNuevos.password.length < 6) {
          mensajeError.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
          return false
        }
        datosAActualizar.password = datosNuevos.password
      }

      // 3. Guardar en Dexie
      await database.usuarios.update(idAdmin, datosAActualizar)

      // 4. Actualizar la sesión actual en AuthStore
      const authStore = useAuthStore()
      authStore.usuarioActual.nombre = datosAActualizar.nombre
      authStore.usuarioActual.nombreusuario = datosAActualizar.nombreusuario

      mensajeExito.value = 'Perfil de administrador actualizado con éxito.'
      return true

    } catch (error) {
      console.error('Error al actualizar admin:', error)
      mensajeError.value = 'Ocurrió un error al guardar los cambios.'
      return false
    } finally {
      cargando.value = false
    }
  }

  const limpiarMensajes = () => {
    mensajeError.value = ''
    mensajeExito.value = ''
  }

  return { cargando, mensajeError, mensajeExito, actualizarPerfilAdmin, limpiarMensajes }
})