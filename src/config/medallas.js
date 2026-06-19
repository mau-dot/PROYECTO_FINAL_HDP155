// Lista global de medallas del juego. vivo tiyos que los ids deben coincidir con los niveles de las lecciones
export const LISTA_MEDALLAS = [
  {
    id: 1,
    nombre: 'Explorador Inicial',
    descripcion: '¡Completaste el Nivel 1 a la perfección!',
    icono: 'https://thumbs.dreamstime.com/b/medalla-de-oro-para-el-cuarto-lugar-429463368.jpg',
    colorBorder: '#4caf50',
  },
  {
    id: 2,
    nombre: 'Maestro del Ritmo',
    descripcion: '¡Dominaste el Nivel 2 sin cometer errores!',
    icono:
      'https://img.magnific.com/psd-premium/bronze-medal-with-number-3-and-laurel-wreath_1296994-119119.jpg?semt=ais_hybrid&w=740&q=80',
    colorBorder: '#2196f3',
  },
  {
    id: 3,
    nombre: 'Cazador de Estrellas',
    descripcion: '¡Superaste todo el Nivel 3 con un 100%!',
    icono:
      'https://img.magnific.com/psd-gratis/medallas-renderizado-3d-composicion-premio-al-campeon_314999-3100.jpg?semt=ais_hybrid&w=740&q=80',
    colorBorder: '#9c27b0',
  },
  {
    id: 4,
    nombre: 'Super Campeón',
    descripcion: '¡Conquistaste el Nivel 4 de forma perfecta!',
    icono:
      'https://img.magnific.com/psd-gratis/medallas-renderizado-3d-composicion-premio-al-campeon_314999-3094.jpg',
    colorBorder: '#ff9800',
  },
]
// Función para buscar una medalla por su id
export const obtenerMedallaPorId = (id) => {
  return LISTA_MEDALLAS.find((medalla) => medalla.id === Number(id)) || null
}
