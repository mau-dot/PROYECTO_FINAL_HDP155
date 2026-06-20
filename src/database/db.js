import Dexie from 'dexie';

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

const HASH_PASSWORD_PRUEBA = '$2b$10$859wDrZxYxp3DKDYfUmJeOj.h6lRmzTsSEnEgS7gpkMewsl4KCtkO' // 👈 reemplaza esto

// Este evento se dispara SOLO la primera vez que se crea la base de datos en el navegador.
// Nos sirve para tener datos de prueba listos justo después de clonar el repositorio.
database.on('populate', async () => {

  //Crear el usuario Administrador por defecto
  await database.usuarios.add({ 
    nombreusuario: 'admin', 
    nombre: 'Administrador General',
    password: HASH_PASSWORD_PRUEBA, // contraseña real: "123"
    rol: 'admin',
    fechaRegistro: new Date().toISOString()
  });

  //Crear un usuario child de prueba (Nivel 1: 1-2 años)
  await database.usuarios.add({
    nombreusuario: 'child_prueba',
    nombre: 'Child de Prueba',
    apellido: 'Ejemplo',
    password: HASH_PASSWORD_PRUEBA,
    rol: 'child',
    nivel: 1, // Inicia en el nivel 1 de colores y hábitos
    edad: 2,//edad
    medallasCount: 0, // Campo adicional que no necesita estar indexado arriba
    fechaRegistro: new Date().toISOString()
  });


  //debug
  console.log('Base de datos inicializada con éxito y usuarios de prueba creados.');
});