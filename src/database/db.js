import Dexie from 'dexie';
import { useCrypto } from '@/composables/useCrypto'

// ==========================================
// 1. INICIALIZACION DE LA BASE DE DATOS
// ==========================================


// Creamos la instancia de la base de datos con su nombre
export const database = new Dexie('HDP_EduKids_DB');

// ==========================================
// 2. DEFINICION DE TABLAS
// ==========================================
// nota en dexie no se necesita declarar todos los campos; solo los que vamos a consultar.
database.version(1).stores({
  // Usuarios: '++id' autoincremental. filtro por 'nombreusuario' (para el login), 'rol' y 'nivel'.
  usuarios: '++id, nombreusuario, apellido, edad, rol, nivel', 
  
  // Lecciones: filtro por 'nivel' para cargar rapido las lecciones que le tocan al child por edad.
  lecciones: '++id, nivel, titulo, tipo', 
  
  // Medallas: solo necesitamos buscar por nombre o id.
  medallas: '++id, nombre',
  
  // Progreso: registra cada intento de una lección por cada child.
  // El índice compuesto '[usuarioId+leccionId]' permite identificar repeticiones de una misma lección.
  progress: '++id, usuarioId, leccionId, nivel, puntaje, esCompletado, fechaIntento, [usuarioId+leccionId]'
});

// ==========================================
// 3. DATOS DE PRUEBA
// ==========================================

// IMPORTANTE: bcrypt (hashPassword) es asíncrono y lento a propósito por seguridad.

// Si se llama DENTRO de la transacción de populate, esta se cierra antes de
// tiempo y lanza TransactionInactiveError.

// La solucion de Dexie es envolver
// las operaciones de escritura en su propio bloque con Dexie.waitFor(),
// que mantiene la transaccion "viva" mientras esperamos una promesa externa.
database.on('populate', () => {
  return Dexie.waitFor(
    (async () => {
      const { hashPassword } = useCrypto()
 
      // 1. Encriptamos las contraseñas de prueba
      const passwordAdmin = await hashPassword('123')
      const passwordChild = await hashPassword('123')
 
      // 2. Guardamos el usuario Administrador por defecto
      await database.usuarios.add({
        nombreusuario: 'admin',
        nombre: 'Administrador General',
        password: passwordAdmin,
        rol: 'admin',
        fechaRegistro: new Date().toISOString()
      })
 
      // 3. Guardamos un usuario child de prueba (Nivel 1: 1-2 años)
      await database.usuarios.add({
        nombreusuario: 'child_prueba',
        nombre: 'Child de Prueba',
        apellido: 'Ejemplo',
        password: passwordChild,
        rol: 'child',
        nivel: 1,
        edad: 2,
        medallasCount: 0,
        fechaRegistro: new Date().toISOString()
      })
 
      //debug
      console.log('Base de datos inicializada con éxito y usuarios de prueba creados.')
    })()
  )
});