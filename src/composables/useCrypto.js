
import bcrypt from 'bcryptjs'
import Swal from 'sweetalert2'

//"vueltas" que da el algoritmo para generar el salt.
//mas alto => mas seguro pero mas lento (10 es el valor estandar recomendado)
const SALT_ROUNDS = 10

export function useCrypto() {

  //convierte una contraseña en texto plano a un hash seguro
  const hashPassword = async (passwordPlano) => {
    try {
      const hash = await bcrypt.hash(passwordPlano, SALT_ROUNDS)
      return hash
    } catch (error) {
        //debug
      console.error('Error al encriptar la contraseña:', error)
       Swal.fire({
        icon: 'error',
        title: 'Error de seguridad',
        text: 'No se pudo procesar la contraseña. Intenta nuevamente.'
      })
      throw new Error('No se pudo procesar la contraseña')
    }
  }

 
  // Retorna true si coinciden, false si no
  const compararPassword = async (passwordPlano, hashGuardado) => {
    try {
      const coincide = await bcrypt.compare(passwordPlano, hashGuardado)
      return coincide
    } catch (error) {
      console.error('Error al comparar la contraseña:', error)
        Swal.fire({
        icon: 'error',
        title: 'Error de seguridad',
        text: 'No se pudo verificar la contraseña. Intenta nuevamente.'
      })
      return false
    }
  }

  return {
    hashPassword,
    compararPassword
  }
}