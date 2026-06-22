// stores/leccionesStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { database } from '@/database/db'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

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

  const cargarDatosNivelCompleto = async (nivelRequerido, usuarioId) => {
    try {
      cargando.value = true
      const lecciones = await database.lecciones.where({ nivel: Number(nivelRequerido) }).toArray()
      const progreso = await database.progress
        .where('usuarioId')
        .equals(Number(usuarioId))
        .toArray()
      const completadas = progreso.filter((p) => p.esCompletado).map((p) => p.leccionId)
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

 const guardarProgreso = async (leccion, aciertos, errores) => {
  try {
    const authStore = useAuthStore()
    const usuarioId = authStore.usuarioActual?.id
    if (!usuarioId || !leccion?.id) return

    const totalEjercicios = leccion.contenido?.length || 1
    const puntaje = Math.round((aciertos / totalEjercicios) * 100)
    const esCompletado = errores === 0

    const registroExistente = await database.progress
      .where('[usuarioId+leccionId]')
      .equals([usuarioId, leccion.id])
      .first()

    if (registroExistente) {
      if (puntaje > registroExistente.puntaje) {
        await database.progress.update(registroExistente.id, {
          puntaje,
          errores,
          esCompletado,
          fechaIntento: new Date().toISOString(),
        })
      }
    } else {
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
      // Alerta 1 — Lección perfecta
      await Swal.fire({
        title: '¡Lección Perfecta! 🎉',
        text: '¡Completaste la lección al 100% sin cometer ningún error! Sigue acumulando victorias. 🏅',
        width: 600,
        padding: '3em',
        color: '#3B6D11',
        background: '#f0fff0',
        confirmButtonText: '¡Seguir jugando!',
        confirmButtonColor: '#639922',
        backdrop: `
          rgba(0, 100, 0, 0.4)
          left top
          no-repeat
        `,
      })

      const usuarioDb = await database.usuarios.get(usuarioId)

      if (usuarioDb) {
        const medallasDesbloqueadas = usuarioDb.medallasDesbloqueadas || []
        const medallaId = Number(leccion.nivel)
        const nivelActualUsuario = Number(usuarioDb.nivel || 1)
        const siguienteNivel = nivelActualUsuario + 1
        const nuevosDatos = {}

        // Agregar medalla si no la tiene
        if (!medallasDesbloqueadas.includes(medallaId)) {
          medallasDesbloqueadas.push(medallaId)
          nuevosDatos.medallasDesbloqueadas = medallasDesbloqueadas
          nuevosDatos.medallasCount = medallasDesbloqueadas.length
        }

        // Verificar si completó todas las lecciones del nivel actual perfectamente
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

        // Añadir la lección actual manualmente para evitar delay asíncrono
        leccionesPerfectasIds.add(leccion.id)

        const tieneTodoPerfecto = todasLasLeccionesNivel.every((l) =>
          leccionesPerfectasIds.has(l.id),
        )

        if (tieneTodoPerfecto && todasLasLeccionesNivel.length > 0) {

          // ✅ Caso 1 — Completó el nivel 4 → verificar las 4 medallas
          if (Number(leccion.nivel) === 4) {
            const medallasActualizadas = nuevosDatos.medallasDesbloqueadas || medallasDesbloqueadas
            const tieneLas4Medallas = [1, 2, 3, 4].every(m => medallasActualizadas.includes(m))

            if (tieneLas4Medallas) {
              await Swal.fire({
                title: '¡Eres un Campeón! 🏆',
                html: `<strong>¡Felicidades!</strong><br><br>Has completado <strong>todos los niveles</strong> de EduKids perfectamente y ganaste las <strong>4 medallas</strong>.<br><br>¡Eres un verdadero genio! 🌟⭐🎓`,
                width: 600,
                padding: '3em',
                color: '#854F0B',
                background: '#fffbe6',
                confirmButtonText: '¡Soy un campeón! 🏆',
                confirmButtonColor: '#f59e0b',
                backdrop: `
                  rgba(255, 193, 7, 0.4)
                  url("https://sweetalert2.github.io/images/nyan-cat.gif")
                  left top
                  no-repeat
                `,
              })
            }

          // ✅ Caso 2 — Completó un nivel menor → sube de nivel
          } else if (Number(leccion.nivel) === nivelActualUsuario && siguienteNivel <= 4) {
            nuevosDatos.nivel = siguienteNivel

            await Swal.fire({
              title: '¡Subiste de Nivel! 🚀',
              html: `¡Dominaste por completo el <strong>Nivel ${leccion.nivel}</strong>!<br><br>Se han abierto las puertas del <strong>Nivel ${siguienteNivel}</strong> para ti. 🌟`,
              width: 600,
              padding: '3em',
              color: '#185FA5',
              background: '#f0f4ff',
              confirmButtonText: '¡Vamos al siguiente nivel!',
              confirmButtonColor: '#0d6efd',
              backdrop: `
                rgba(0, 0, 123, 0.4)
                left top
                no-repeat
              `,
            })
          }
        }

        if (Object.keys(nuevosDatos).length > 0) {
          await database.usuarios.update(usuarioId, nuevosDatos)
          if (nuevosDatos.medallasDesbloqueadas) {
            authStore.usuarioActual.medallasDesbloqueadas = nuevosDatos.medallasDesbloqueadas
            authStore.usuarioActual.medallasCount = nuevosDatos.medallasCount
          }
          if (nuevosDatos.nivel) {
            authStore.usuarioActual.nivel = nuevosDatos.nivel
          }
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
    cargarDatosNivelCompleto,
    obtenerLeccionPorId,
    guardarProgreso,
    limpiarMensajes,
  }
})
