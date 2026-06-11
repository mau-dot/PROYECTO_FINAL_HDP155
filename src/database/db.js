import Dexie from 'dexie';

// ==========================================
// 1. INICIALIZACION DE LA BASE DE DATOS
// ==========================================


// Creamos la instancia de la base de datos con su nombre
export const db = new Dexie('HDP_EduKids_DB');

// ==========================================
// 2. DEFINICION DE TABLAS
// ==========================================
// nota en dixie no se necesita declarar todo lo principla la llave primaria (++)
db.version(1).stores({
  // Usuarios: '++id' autoincremental. filtro por 'username' (para el login), 'role' y 'level'.
  users: '++id, username, age, role, level', 
  
  // Lecciones: filtro por 'level' para cargar rapido las lecciones que le tocan al niño por edad.
  lessons: '++id, level, title', 
  
  // Medallas: solo necesitamos buscar por nombre o id.
  medals: '++id, name',
  
  // Progreso: registra que lecciones ha completado cada niño. 
  // El índice compuesto '[userId+lessonId]' verificacion rapida (si un niño ya hizo una lección específica.)
  progress: '++id, userId, level, isCompleted, [userId+lessonId]' 
});

// ==========================================
// 3. DATOS DE PRUEBA
// ==========================================
// Este evento se dispara SOLO la primera vez que se crea la base de datos en el navegador.
// Nos sirve para tener datos de prueba listos justo después de clonar el repositorio.
db.on('populate', async () => {
  
  // 3.1 Crear el usuario Administrador por defecto
  await db.users.add({ 
    username: 'admin', 
    password: '123', // Para fines académicos y de prueba inicial
    role: 'admin' 
  });

  // 3.2 Crear un usuario Niño de prueba (Nivel 1: 1-2 años)
  await db.users.add({
    username: 'niño_prueba',
    password: '123',
    role: 'child',
    level: 1, // Inicia en el nivel 1 de colores y hábitos
    age: 2,//edad
    medalsCount: 0 // Campo adicional que no necesita estar indexado arriba
  });


  //debug
  console.log('Base de datos inicializada con éxito y usuarios de prueba creados.');
});