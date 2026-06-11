import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {database} from '@/database/db'

export const useAuthStore = defineStore('auth', () => {

    // variables reactivas
    const usuarioActual = ref(null)
    const cargando = ref(false)
    const mensajeError = ref('')

    //funciones getters (propiedades computadas)
    const estaAutenticado = computed(() => usuarioActual.value !== null);

    const esAdmin = computed(() => usuarioActual.value?.rol === 'admin');

    const edadUsuario = computed(() => usuarioActual.value?.edad || null);

    const nivelUsuario = computed(() => usuarioActual.value?.nivel || null);



    
    //funciones acciones
    const iniciarSesion = async (nombreusuario, password) => {
        cargando.value = true;
        mensajeError.value = '';
    
        try {
        // Consultamos a Dexie filtrando por el nombre de usuario
        const usuario = await database.usuarios.get({ nombreusuario: nombreusuario });

        if (usuario && usuario.password === password) {
            
            const { password: _, ...datosUsuario } = usuario;
            usuarioActual.value = datosUsuario;
            return true; // Login exitoso
        } else {
            mensajeError.value = 'Usuario o contraseña incorrectos';
            return false; // Login fallido
        }
        } catch (error) {
            console.error('Error al conectar con la base de datos:', error);
            mensajeError.value = 'Ocurrió un error al intentar iniciar sesión';
            return false;
        } finally {
            cargando.value = false;
        }

    }
    // Función para registrar nuevos administradores
  const registrarUsuario = async (datosNuevoUsuario) => {
    cargando.value = true;
    mensajeError.value = '';

    try {
      // 1. Verificamos si el nombre de usuario ya está en uso
      const existe = await database.usuarios.get({ nombreusuario: datosNuevoUsuario.usuario });
      
      if (existe) {
        mensajeError.value = 'El nombre de usuario ya existe';
        return false; // Falló el registro
      }

      // 2. Si no existe, lo guardamos en Dexie
      // Mapeamos los datos del formulario a las columnas de la DB
      await database.usuarios.add({
        nombreusuario: datosNuevoUsuario.usuario,
        password: datosNuevoUsuario.password,
        rol: datosNuevoUsuario.rol,
        nombre: datosNuevoUsuario.nombre, // Guardamos el nombre real también
        nivel: null, // Como es Admin, no tiene nivel
        edad: null   // Ni edad de juego
      });

      return true; // Registro exitoso
    } catch (error) {
      console.error('Error al registrar:', error);
      mensajeError.value = 'Error al intentar crear la cuenta';
      return false;
    } finally {
      cargando.value = false;
    }
  };
  // Función para que el Admin registre nuevos niños (jugadores)
  const registrarNino = async (datosNino) => {
    cargando.value = true;
    mensajeError.value = '';

    try {
      // 1. Verificamos si el nombre de usuario (nickname) ya está en uso
      const existe = await database.usuarios.get({ nombreusuario: datosNino.usuario });
      
      if (existe) {
        mensajeError.value = 'Este nombre de usuario ya está asignado a otro niño.';
        return false; 
      }

      // 2. Guardamos el perfil del niño en Dexie
      await database.usuarios.add({
        nombreusuario: datosNino.usuario,
        password: datosNino.password, // Usualmente un PIN corto de 4 dígitos
        rol: 'child',                 // Rol fijo para jugadores
        nombre: datosNino.nombre,     // Nombre real del niño
        edad: datosNino.edad,         // Para estadísticas o reportes
        nivel: datosNino.nivel,       // Define a qué juegos tiene acceso
        medallasCount: 0              // Todos los niños inician con 0 medallas
      });

      return true; // Registro exitoso
    } catch (error) {
      console.error('Error al registrar niño:', error);
      mensajeError.value = 'Error al intentar crear el perfil del jugador.';
      return false;
    } finally {
      cargando.value = false;
    }
  };

    // Funcion para limpiar los datos al salir (cerrar sesión)
    const cerrarSesion = () => {
        usuarioActual.value = null;
    };

    // Retornamos todo lo que necesitamos exponer a los componentes
    return {
        usuarioActual,
        cargando,
        mensajeError,
        estaAutenticado,
        esAdmin,
        edadUsuario,
        nivelUsuario,
        iniciarSesion,
        registrarUsuario,
        registrarNino,
        cerrarSesion
    };
    
});