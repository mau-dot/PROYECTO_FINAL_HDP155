// stores/leccionesStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { database } from '@/database/db'

export const useLeccionesStore = defineStore('lecciones', () => {

  // ===== DATOS =====
  const listaLecciones = ref([])
  const cargando = ref(false)
  const mensajeError = ref('')
  const mensajeExito = ref('')

  // ===== VALIDACIONES =====
  const validarLeccion = (datos) => {
    if (!datos.titulo || datos.titulo.trim().length < 3) {
      return 'El título debe tener al menos 3 caracteres'
    }
    if (!datos.nivel || datos.nivel < 1 || datos.nivel > 4) {
      return 'El nivel debe estar entre 1 y 4'
    }
    if (!datos.tipo || datos.tipo.trim() === '') {
      return 'El tipo de lección es obligatorio'
    }
    if (!datos.contenido || datos.contenido.trim().length < 5) {
      return 'El contenido debe tener al menos 5 caracteres'
    }
    return null // null = sin errores
  }

  // ===== ACCIONES =====

  // Cargar todas las lecciones
  const cargarLecciones = async () => {
    cargando.value = true
    mensajeError.value = ''
    try {
      listaLecciones.value = await database.lecciones.toArray()
    } catch (error) {
      console.error('Error al cargar lecciones:', error)
      mensajeError.value = 'No se pudieron cargar las lecciones'
    } finally {
      cargando.value = false
    }
  }

  // Guardar lección nueva o editar una existente
  const guardarLeccion = async (datosLeccion) => {
    mensajeError.value = ''
    mensajeExito.value = ''

    // Validar antes de guardar
    const error = validarLeccion(datosLeccion)
    if (error) {
      mensajeError.value = error
      return false
    }

    cargando.value = true
    try {
      if (datosLeccion.id) {
        // Editar lección existente
        await database.lecciones.update(datosLeccion.id, datosLeccion)
        mensajeExito.value = 'Lección actualizada correctamente'
      } else {
        // Crear lección nueva
        await database.lecciones.add(datosLeccion)
        mensajeExito.value = 'Lección creada correctamente'
      }
      await cargarLecciones()
      return true
    } catch (error) {
      console.error('Error al guardar lección:', error)
      mensajeError.value = 'No se pudo guardar la lección'
      return false
    } finally {
      cargando.value = false
    }
  }

  // Eliminar una lección por su id
  const eliminarLeccion = async (idLeccion) => {
    mensajeError.value = ''
    mensajeExito.value = ''

    if (!idLeccion) {
      mensajeError.value = 'ID de lección no válido'
      return false
    }

    cargando.value = true
    try {
      await database.lecciones.delete(idLeccion)
      await cargarLecciones()
      mensajeExito.value = 'Lección eliminada correctamente'
      return true
    } catch (error) {
      console.error('Error al eliminar lección:', error)
      mensajeError.value = 'No se pudo eliminar la lección'
      return false
    } finally {
      cargando.value = false
    }
  }

  // Limpiar mensajes manualmente si se necesita
  const limpiarMensajes = () => {
    mensajeError.value = ''
    mensajeExito.value = ''
  }

  return {
    listaLecciones,
    cargando,
    mensajeError,
    mensajeExito,
    cargarLecciones,
    guardarLeccion,
    eliminarLeccion,
    limpiarMensajes
  }
})