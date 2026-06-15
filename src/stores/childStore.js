// stores/childStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { database } from '@/database/db'

export const useChildStore = defineStore('child', () => {

  // ===== DATOS =====
  const listaAlumnos = ref([])
  const cargando = ref(false)
  const mensajeError = ref('')
  const mensajeExito = ref('')

  // ===== VALIDACIONES =====

  // Valida el formato del nombre de usuario
  const validarNombreUsuario = (nombreusuario) => {
    if (!nombreusuario || nombreusuario.trim().length < 4) {
      return 'El nombre de usuario debe tener al menos 4 caracteres'
    }
    if (nombreusuario.length > 20) {
      return 'El nombre de usuario no puede superar los 20 caracteres'
    }
    // Solo letras, números y guión bajo — sin espacios ni caracteres especiales
    const formatoValido = /^[a-zA-Z0-9_]+$/
    if (!formatoValido.test(nombreusuario)) {
      return 'Solo se permiten letras, números y guión bajo (_). Sin espacios.'
    }
    return null // null = sin errores
  }

  // Valida la contraseña o PIN
  const validarPassword = (password) => {
    if (!password || password.length < 4) {
      return 'La contraseña debe tener al menos 4 caracteres'
    }
    if (password.length > 8) {
      return 'La contraseña no puede superar los 8 caracteres'
    }
    return null
  }

  // Valida los datos completos de un niño al registrarlo
  const validarDatosNino = async (datos, esEdicion = false) => {
    // Validar nombre de usuario
    const errorNombre = validarNombreUsuario(datos.nombreusuario)
    if (errorNombre) return errorNombre

    // Validar contraseña solo si es registro nuevo o si se está cambiando
    if (!esEdicion || datos.password) {
      const errorPassword = validarPassword(datos.password)
      if (errorPassword) return errorPassword
    }

    if (!datos.nombre || datos.nombre.trim().length < 2) {
      return 'El nombre real debe tener al menos 2 caracteres'
    }
    if (!datos.edad || datos.edad < 1 || datos.edad > 8) {
      return 'La edad debe estar entre 1 y 8 años'
    }
    if (!datos.nivel || datos.nivel < 1 || datos.nivel > 4) {
      return 'El nivel debe estar entre 1 y 4'
    }

    // Verificar que el nombre de usuario no esté en uso (solo en registro nuevo)
    if (!esEdicion) {
      const existe = await database.usuarios.get({ nombreusuario: datos.nombreusuario })
      if (existe) return 'Este nombre de usuario ya está en uso'
    }

    return null // null = sin errores
  }

  // ===== CALCULOS (GETTERS) =====

  // Lista de alumnos con progreso calculado para mostrar en tablas
  const listaAlumnosMapeados = computed(() => {
    if (!Array.isArray(listaAlumnos.value)) return []
    return listaAlumnos.value.map(alumno => {
      const progreso = alumno.nivel ? Math.min(alumno.nivel * 25, 100) : 0
      return {
        id: alumno.id,
        nombre: `${alumno.nombre || 'Niño'} ${alumno.apellido || ''}`.trim(),
        nombreusuario: alumno.nombreusuario,
        edad: alumno.edad || 0,
        nivel: alumno.nivel || 1,
        progreso,
        medallasCount: alumno.medallasCount || 0
      }
    })
  })

  // KPIs para el panel del administrador
  const totalAlumnos = computed(() => listaAlumnos.value.length)

  const promedioProgreso = computed(() => {
    if (listaAlumnos.value.length === 0) return 0
    const sumaNiveles = listaAlumnos.value.reduce((acc, al) => acc + (al.nivel || 1), 0)
    return Math.round((sumaNiveles / (listaAlumnos.value.length * 4)) * 100)
  })

  const totalNivelMax = computed(() =>
    listaAlumnos.value.filter(al => al.nivel === 4).length
  )

  // ===== ACCIONES DEL ADMINISTRADOR =====

  // Cargar todos los alumnos (solo admin)
  const cargarAlumnos = async () => {
    cargando.value = true
    mensajeError.value = ''
    try {
      listaAlumnos.value = await database.usuarios
        .where('rol').equals('child').toArray()
    } catch (error) {
      console.error('Error al cargar alumnos:', error)
      mensajeError.value = 'No se pudieron cargar los alumnos'
    } finally {
      cargando.value = false
    }
  }

  // Registrar un niño nuevo (solo admin)
  const registrarNino = async (datosNino) => {
    mensajeError.value = ''
    mensajeExito.value = ''

    const error = await validarDatosNino(datosNino, false)
    if (error) {
      mensajeError.value = error
      return false
    }

    cargando.value = true
    try {
      await database.usuarios.add({
        nombreusuario: datosNino.nombreusuario.trim(),
        password: datosNino.password,
        rol: 'child',
        nombre: datosNino.nombre.trim(),
        apellido: datosNino.apellido?.trim() || '',
        edad: datosNino.edad,
        nivel: datosNino.nivel,
        medallasCount: 0,
        fechaRegistro: new Date().toISOString()
      })
      await cargarAlumnos()
      mensajeExito.value = 'Niño registrado correctamente'
      return true
    } catch (error) {
      console.error('Error al registrar niño:', error)
      mensajeError.value = 'No se pudo registrar el niño'
      return false
    } finally {
      cargando.value = false
    }
  }

  // Eliminar un alumno por su id (solo admin)
  const eliminarAlumno = async (idAlumno) => {
    mensajeError.value = ''
    mensajeExito.value = ''

    if (!idAlumno) {
      mensajeError.value = 'ID de alumno no válido'
      return false
    }

    cargando.value = true
    try {
      await database.usuarios.delete(idAlumno)
      await cargarAlumnos()
      mensajeExito.value = 'Alumno eliminado correctamente'
      return true
    } catch (error) {
      console.error('Error al eliminar alumno:', error)
      mensajeError.value = 'No se pudo eliminar el alumno'
      return false
    } finally {
      cargando.value = false
    }
  }

  // ===== ACCIONES DEL NIÑO (sobre su propio perfil) =====

  // Actualizar nombre de usuario propio (niño)
  const actualizarNombreUsuario = async (idNino, nuevoNombreUsuario) => {
    mensajeError.value = ''
    mensajeExito.value = ''

    const error = validarNombreUsuario(nuevoNombreUsuario)
    if (error) {
      mensajeError.value = error
      return false
    }

    // Verificar que el nuevo nombre no esté en uso por otro usuario
    const existe = await database.usuarios.get({ nombreusuario: nuevoNombreUsuario })
    if (existe && existe.id !== idNino) {
      mensajeError.value = 'Este nombre de usuario ya está en uso'
      return false
    }

    cargando.value = true
    try {
      const nombreUsuarioLimpio = datosActualizados.nombreusuario.trim().toLowerCase()

        // Verificar si el nuevo usuario ya existe y NO es de él mismo
      const existe = await database.usuarios.get({ nombreusuario: nombreUsuarioLimpio })
      if (existe && existe.id !== idNino) {
        mensajeError.value = 'Este nombre de usuario ya está ocupado por otro jugador.'
        return false
      }

      await database.usuarios.update(idNino, { nombreusuario: nuevoNombreUsuario.trim() })
      mensajeExito.value = 'Nombre de usuario actualizado correctamente'
      return true
    } catch (error) {
      console.error('Error al actualizar nombre de usuario:', error)
      mensajeError.value = 'No se pudo actualizar el nombre de usuario'
      return false
    } finally {
      cargando.value = false
    }
  }

  // Actualizar contraseña propia (niño)
  const actualizarPassword = async (idNino, nuevaPassword) => {
    mensajeError.value = ''
    mensajeExito.value = ''

    const error = validarPassword(nuevaPassword)
    if (error) {
      mensajeError.value = error
      return false
    }

    cargando.value = true
    try {
      await database.usuarios.update(idNino, { password: nuevaPassword })
      mensajeExito.value = 'Contraseña actualizada correctamente'
      return true
    } catch (error) {
      console.error('Error al actualizar contraseña:', error)
      mensajeError.value = 'No se pudo actualizar la contraseña'
      return false
    } finally {
      cargando.value = false
    }
  }

  // Reiniciar progreso de un nivel (niño)
  const reiniciarNivel = async (idNino, nivel) => {
    mensajeError.value = ''
    mensajeExito.value = ''

    if (!nivel || nivel < 1 || nivel > 4) {
      mensajeError.value = 'Nivel no válido para reiniciar'
      return false
    }

    cargando.value = true
    try {
      // Eliminamos el progreso de ese nivel en la tabla progress
      await database.progress
        .where({ usuarioId: idNino, nivel: nivel })
        .delete()
      mensajeExito.value = `Nivel ${nivel} reiniciado correctamente`
      return true
    } catch (error) {
      console.error('Error al reiniciar nivel:', error)
      mensajeError.value = 'No se pudo reiniciar el nivel'
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
    // Datos
    listaAlumnos,
    listaAlumnosMapeados,
    cargando,
    mensajeError,
    mensajeExito,
    // KPIs
    totalAlumnos,
    promedioProgreso,
    totalNivelMax,
    // Acciones admin
    cargarAlumnos,
    registrarNino,
    eliminarAlumno,
    // Acciones niño
    actualizarNombreUsuario,
    actualizarPassword,
    reiniciarNivel,
    // Utilidades
    limpiarMensajes
  }
})