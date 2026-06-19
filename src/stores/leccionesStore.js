// stores/leccionesStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { database } from '@/database/db'
import { useAuthStore } from '@/stores/auth'

export const useLeccionesStore = defineStore('lecciones', () => {
  const listaLecciones = ref([])
  const cargando = ref(false)
  const mensajeError = ref('')
  const mensajeExito = ref('')

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
    if (!datos.contenido || !Array.isArray(datos.contenido) || datos.contenido.length === 0) {
      return 'Debes agregar al menos un ejercicio a la lección'
    }

    if (datos.tipo === 'opcion_multiple') {
      for (let i = 0; i < datos.contenido.length; i++) {
        const item = datos.contenido[i]
        const opcionesValidas = item.opciones.filter((o) => o.trim() !== '')

        if (opcionesValidas.length < 3) {
          return `La pregunta #${i + 1} debe tener al menos 3 opciones llenas`
        }

        const opcionesUnicas = new Set(opcionesValidas)
        if (opcionesUnicas.size !== opcionesValidas.length) {
          return `La pregunta #${i + 1} tiene opciones de respuesta repetidas`
        }

        if (!item.respuestaCorrecta || item.respuestaCorrecta.trim() === '') {
          return `Selecciona la respuesta correcta para la pregunta #${i + 1}`
        }
      }
    }

    if (datos.tipo === 'completar_oracion') {
      for (let i = 0; i < datos.contenido.length; i++) {
        if (!datos.contenido[i].oracion.includes('___')) {
          return `El ejercicio #${i + 1} debe incluir '___' donde irá la palabra oculta`
        }
      }
    }

    return null
  }

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

  const guardarLeccion = async (datosLeccion) => {
    mensajeError.value = ''
    mensajeExito.value = ''

    const errorValidacion = validarLeccion(datosLeccion)
    if (errorValidacion) {
      mensajeError.value = errorValidacion
      return false
    }

    cargando.value = true
    try {
      if (datosLeccion.id) {
        await database.lecciones.update(datosLeccion.id, datosLeccion)
        mensajeExito.value = 'Lección actualizada correctamente'
      } else {
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

  const cargarLeccionesPorNivel = async (nivelRequerido) => {
    try {
      cargando.value = true
      const leccionesDelNivel = await database.lecciones
        .where({ nivel: Number(nivelRequerido) })
        .toArray()
      return leccionesDelNivel
    } catch (error) {
      console.error(`Error cargando lecciones del nivel ${nivelRequerido}:`, error)
      return []
    } finally {
      cargando.value = false
    }
  }

  // Trae las lecciones de un nivel y filtra los IDs que el alumno ya completó
  const cargarDatosNivelCompleto = async (nivelRequerido, usuarioId) => {
    try {
      cargando.value = true

      // 1. Buscamos todas las lecciones correspondientes a este nivel
      const lecciones = await database.lecciones.where({ nivel: Number(nivelRequerido) }).toArray()

      // 2. Buscamos el progreso de este niño en particular
      const progreso = await database.progress
        .where('usuarioId')
        .equals(Number(usuarioId))
        .toArray()

      // 3. Filtramos solo los IDs de las lecciones que ya completó
      const completadas = progreso.filter((p) => p.esCompletado).map((p) => p.leccionId)

      // Retornamos ambas cosas empaquetadas de forma limpia
      return {
        lecciones: lecciones || [],
        completadas: completadas || [],
      }
    } catch (error) {
      console.error(`Error cargando los datos maestros del nivel ${nivelRequerido}:`, error)
      return { lecciones: [], completadas: [] }
    } finally {
      cargando.value = false
    }
  }

  const obtenerLeccionPorId = async (idLeccion) => {
    try {
      cargando.value = true
      return await database.lecciones.get(Number(idLeccion))
    } catch (error) {
      console.error('Error obteniendo la lección:', error)
      return null
    } finally {
      cargando.value = false
    }
  }

  // Guarda el progreso y maneja la lógica de nivelación/medallas si la lección se pasa sin errores
  const guardarProgreso = async (leccion, aciertos, errores) => {
    try {
      const authStore = useAuthStore()
      const usuarioId = authStore.usuarioActual?.id
      if (!usuarioId || !leccion?.id) return

      const totalEjercicios = leccion.contenido?.length || 1
      const puntaje = Math.round((aciertos / totalEjercicios) * 100)

      // Solo se considera completada si no hubo ningún error
      const esCompletado = errores === 0

      // Buscar si ya existe un registro para este usuario + lección
      const registroExistente = await database.progress
        .where('[usuarioId+leccionId]')
        .equals([usuarioId, leccion.id])
        .first()

      if (registroExistente) {
        // Solo actualizamos si supera la puntuación anterior (evita pisar un 100% perfecto)
        if (puntaje > registroExistente.puntaje) {
          await database.progress.update(registroExistente.id, {
            puntaje,
            errores,
            esCompletado,
            fechaIntento: new Date().toISOString(),
          })
        }
      } else {
        // Primer intento: crear el registro
        await database.progress.add({
          usuarioId,
          leccionId: leccion.id,
          nivel: leccion.nivel,
          puntaje,
          errores,
          esCompletado,
          fechaIntento: new Date().toISOString(),
        })
      }

      if (esCompletado) {
        alert(
          '🎉 ¡LECCION PERFECTA! 🎉\n\n¡Completaste la lección al 100% sin cometer ningún error!\n\nSigue acumulando victorias. 🏅',
        )

        const usuarioDb = await database.usuarios.get(usuarioId)

        if (usuarioDb) {
          const medallasDesbloqueadas = usuarioDb.medallasDesbloqueadas || []
          const medallaId = Number(leccion.nivel) // La medalla corresponde al nivel de la lección

          const siguienteNivel = Number(leccion.nivel) + 1
          const nivelActualUsuario = Number(usuarioDb.nivel || 1)

          const nuevosDatos = {}

          if (!medallasDesbloqueadas.includes(medallaId)) {
            medallasDesbloqueadas.push(medallaId)
            nuevosDatos.medallasDesbloqueadas = medallasDesbloqueadas
            nuevosDatos.medallasCount = medallasDesbloqueadas.length
          }

          // Sube de nivel si la lección corresponde a su nivel actual y no supera el ultimo nivel (Nivel 4)
          if (Number(leccion.nivel) === nivelActualUsuario && siguienteNivel <= 4) {
            const todasLasLeccionesNivel = await database.lecciones
              .where('nivel')
              .equals(Number(leccion.nivel))
              .toArray()

            const progresosPrevios = await database.progress
              .where({ usuarioId: usuarioId, nivel: Number(leccion.nivel) })
              .toArray()

            const leccionesPerfectasIds = new Set(
              progresosPrevios
                .filter((p) => p.esCompletado === true || p.errores === 0)
                .map((p) => p.leccionId),
            )

            // Añadimos manualmente el ID actual para evitar el delay asíncrono de Dexie
            leccionesPerfectasIds.add(leccion.id)

            const tieneTodoPerfecto = todasLasLeccionesNivel.every((l) =>
              leccionesPerfectasIds.has(l.id),
            )

            // Si resolvió todas las lecciones existentes de este nivel sin fallas, sube de rango
            if (tieneTodoPerfecto && todasLasLeccionesNivel.length > 0) {
              nuevosDatos.nivel = siguienteNivel

              alert(
                `🚀 ¡FELICIDADES ASCENDISTE DE RANGO! 🚀\n\n¡Dominaste por completo el Nivel ${leccion.nivel}!\n\nSe han abierto las puertas del Nivel ${siguienteNivel} para ti.`,
              )
            }
          }

          // Si hubo cambios en medallas o en nivel, guardamos los datos
          if (Object.keys(nuevosDatos).length > 0) {
            // Actualizamos en la base de datos de Dexie
            await database.usuarios.update(usuarioId, nuevosDatos)

            // Sincronizamos en vivo el AuthStore con los datos modificados
            if (nuevosDatos.medallasDesbloqueadas) {
              authStore.usuarioActual.medallasDesbloqueadas = nuevosDatos.medallasDesbloqueadas
              authStore.usuarioActual.medallasCount = nuevosDatos.medallasCount
            }
            if (nuevosDatos.nivel) {
              authStore.usuarioActual.nivel = nuevosDatos.nivel
            }

            // Actualizamos el localStorage para mantener los cambios al recargar
            localStorage.setItem('hdp_sesion', JSON.stringify(authStore.usuarioActual))
          }
        }
      }
    } catch (error) {
      console.error('Error guardando progreso:', error)
    }
  }

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
    cargarLeccionesPorNivel,
    cargarDatosNivelCompleto,
    obtenerLeccionPorId,
    guardarProgreso,
    limpiarMensajes,
  }
})
