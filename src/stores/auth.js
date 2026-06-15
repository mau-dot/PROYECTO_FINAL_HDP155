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

  // funciones getters (propiedades computadas)
  const estaAutenticado = computed(() => usuarioActual.value !== null)
  const esAdmin = computed(() => usuarioActual.value?.rol === 'admin')
  const esChild = computed(()=> usuarioActual.value?.rol === 'child')
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
        }
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

  // Función para registrar nuevos administradores(posible eliminacion)
  const registrarUsuario = async (datosNuevoUsuario) => {
    cargando.value = true
    mensajeError.value = ''
    const nombreUsuarioLimpio = normalizarNombreUsuario(datosNuevoUsuario?.usuario)

    try {
      if (!nombreUsuarioLimpio || !datosNuevoUsuario?.password || !datosNuevoUsuario?.nombre) {
        mensajeError.value = 'Completa todos los datos del administrador'
        return false
      }

      const totalAdministradores = await database.usuarios.where('rol').equals('admin').count()

      if (totalAdministradores > 0) {
        mensajeError.value = 'Ya existe un administrador central registrado'
        return false
      }

      const existe = await database.usuarios.get({ nombreusuario: nombreUsuarioLimpio })

      if (existe) {
        mensajeError.value = 'El nombre de usuario ya existe'
        return false
      }

      await database.usuarios.add({
        nombreusuario: nombreUsuarioLimpio,
        password: datosNuevoUsuario.password,
        rol: 'admin',
        nombre: String(datosNuevoUsuario.nombre).trim(),
        fechaRegistro: new Date().toISOString(),
      })

      return true
    } catch (error) {
      console.error('Error al registrar:', error)
      mensajeError.value = 'Error al intentar crear la cuenta'
      return false
    } finally {
      cargando.value = false
    }
  }

  // Función para que el Admin registrar nuevos childs (jugadores)
  const registrarChild = async (datosChild) => {
    cargando.value = true
    mensajeError.value = ''
    const nombreUsuarioLimpio = normalizarNombreUsuario(datosChild?.usuario)

    try {
      if (!nombreUsuarioLimpio || !datosChild?.password || !datosChild?.nombre) {
        mensajeError.value = 'Completa todos los datos del child'
        return false
      }

      const existe = await database.usuarios.get({ nombreusuario: nombreUsuarioLimpio })

      if (existe) {
        mensajeError.value = 'Este nombre de usuario ya está asignado a otro child.'
        return false
      }

      await database.usuarios.add({
        nombreusuario: nombreUsuarioLimpio,
        password: datosChild.password,
        rol: 'child',
        nombre: String(datosChild.nombre).trim(),
        edad: Number(datosChild.edad),
        nivel: Number(datosChild.nivel),
        medallasCount: 0,
      })

      return true
    } catch (error) {
      console.error('Error al registrar child:', error)
      mensajeError.value = 'Error al intentar crear el perfil del jugador.'
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
    registrarUsuario,
    registrarChild,
    cerrarSesion,
  }
})
