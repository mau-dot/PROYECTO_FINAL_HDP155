import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {database} from '../database'

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
        cerrarSesion
    };
    
});