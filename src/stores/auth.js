import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { database } from '@/database/db'

export const useAuthStore = defineStore('auth', () => {
  const normalizarNombreUsuario = (valor) =>
    String(valor ?? '')
      .trim()
      .toLowerCase()

  // variables reactivas
  const usuarioActual = ref(null)
  const cargando = ref(false)
  const mensajeError = ref('')

  const sesionGuardada = localStorage.getItem('hdp_sesion')
  if (sesionGuardada) {
    usuarioActual.value = JSON.parse(sesionGuardada)
  }

  // funciones getters (propiedades computadas)
  const estaAutenticado = computed(() => usuarioActual.value !== null)
  const esAdmin = computed(() => usuarioActual.value?.rol === 'admin')
  const esChild = computed(() => usuarioActual.value?.rol === 'child')
  const edadUsuario = computed(() => usuarioActual.value?.edad ?? null)
  const nivelUsuario = computed(() => usuarioActual.value?.nivel ?? null)

  // funciones acciones
  const iniciarSesion = async (nombreusuario, password) => {
    cargando.value = true
    mensajeError.value = ''
    const nombreUsuarioLimpio = normalizarNombreUsuario(nombreusuario)

    try {
      if (!nombreUsuarioLimpio || !password) {
        mensajeError.value = 'Debes ingresar usuario y contraseña'
        return false
      }

      const usuario = await database.usuarios.get({ nombreusuario: nombreUsuarioLimpio })

      if (usuario && usuario.password === password) {
        // Asignación explícita sin desestructuración pesada
        usuarioActual.value = {
          id: usuario.id,
          nombreusuario: usuario.nombreusuario,
          nombre: usuario.nombre,
          rol: usuario.rol,
          edad: usuario.edad,
          nivel: usuario.nivel,
          medallasCount: usuario.medallasCount || 0,
          medallasDesbloqueadas: usuario.medallasDesbloqueadas || [],
          medallaPerfil: usuario.medallaPerfil || null,
        }
        localStorage.setItem('hdp_sesion', JSON.stringify(usuarioActual.value))
        return true
      } else {
        mensajeError.value = 'Usuario o contraseña incorrectos'
        return false
      }
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error)
      mensajeError.value = 'Ocurrió un error al intentar iniciar sesión'
      return false
    } finally {
      cargando.value = false
    }
  }

  // Funcion para limpiar los datos al salir (cerrar sesión)
  const cerrarSesion = () => {
    usuarioActual.value = null
    mensajeError.value = ''
    cargando.value = false // Asegura que la app no se quede congelada procesando
    localStorage.removeItem('hdp_sesion')
  }

  const esNivelBloqueadoParaChild = (numeroNivelCard) => {
    // Si no hay nadie logueado o es admin, esta regla no aplica aquí
    if (!usuarioActual.value || usuarioActual.value.rol !== 'child') return false

    const nivelDelEstudiante = Number(usuarioActual.value.nivel)

    return Number(numeroNivelCard) > nivelDelEstudiante
  }

  // Bloquea el acceso si el nivel de la tarjeta es mayor al nivel actual del niño
  const equiparMedalla = async (medallaId) => {
    if (!usuarioActual.value || usuarioActual.value.rol !== 'child') return false

    try {
      const idUsuario = usuarioActual.value.id
      const nuevaMedalla = Number(medallaId)

      // Actualizar en la base de datos Dexie
      await database.usuarios.update(idUsuario, { medallaPerfil: nuevaMedalla })

      usuarioActual.value.medallaPerfil = nuevaMedalla

      // Sincroniza el estado en Pinia y LocalStorage
      localStorage.setItem('hdp_sesion', JSON.stringify(usuarioActual.value))
      return true
    } catch (error) {
      console.error('Error al equipar la medalla:', error)
      return false
    }
  }

  return {
    usuarioActual,
    cargando,
    mensajeError,
    estaAutenticado,
    esAdmin,
    esChild,
    edadUsuario,
    nivelUsuario,
    iniciarSesion,
    cerrarSesion,
    esNivelBloqueadoParaChild,
    equiparMedalla,
  }
})
