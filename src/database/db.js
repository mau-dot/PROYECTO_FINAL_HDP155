import Dexie from 'dexie';

// ==========================================
// 1. INICIALIZACION DE LA BASE DE DATOS
// ==========================================


// Creamos la instancia de la base de datos con su nombre
export const database = new Dexie('HDP_EduKids_DB');

// ==========================================
// 2. DEFINICION DE TABLAS
// ==========================================
// nota en dixie no se necesita declarar todo lo principla la llave primaria (++)
database.version(1).stores({
  // Usuarios: '++id' autoincremental. filtro por 'nombreusuario' (para el login), 'rol' y 'nivel'.
  usuarios: '++id, nombreusuario, edad, rol, nivel', 
  
  // Lecciones: filtro por 'nivel' para cargar rapido las lecciones que le tocan al niño por edad.
  lecciones: '++id, nivel, titulo, tipo, contenido', 
  
  // Medallas: solo necesitamos buscar por nombre o id.
  medallas: '++id, nombre',
  
  // Progreso: registra que lecciones ha completado cada niño. 
  // El índice compuesto '[userId+lessonId]' verificacion rapida (si un niño ya hizo una lección específica.)
  progress: '++id, usuarioId, nivel, esCompletado, [usuarioId+leccionId]' 
});

// ==========================================
// 3. DATOS DE PRUEBA
// ==========================================
// Este evento se dispara SOLO la primera vez que se crea la base de datos en el navegador.
// Nos sirve para tener datos de prueba listos justo después de clonar el repositorio.
database.on('populate', async () => {
  
  // 3.1 Crear el usuario Administrador por defecto
  await database.usuarios.add({ 
    nombreusuario: 'admin', 
    password: '123', // Para fines académicos y de prueba inicial
    rol: 'admin' 
  });

  // 3.2 Crear un usuario Niño de prueba (Nivel 1: 1-2 años)
  await database.usuarios.add({
    nombreusuario: 'niño_prueba',
    password: '123',
    rol: 'child',
    nivel: 1, // Inicia en el nivel 1 de colores y hábitos
    edad: 2,//edad
    medallasCount: 0 // Campo adicional que no necesita estar indexado arriba
  });


  //debug
  console.log('Base de datos inicializada con éxito y usuarios de prueba creados.');
});