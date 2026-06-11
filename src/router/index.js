import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'//import store de Pinia


//Importacion de vistas
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

import DashboardView from '@/views/admin/DashboardView.vue'
import ManagementView from '@/views/admin/ManagementView.vue'

import Level1View from '@/views/levels/Level1View.vue'
import Level2View from '@/views/levels/Level2View.vue'
import Level3View from '@/views/levels/Level3View.vue'
import Level4View from '@/views/levels/Level4View.vue'

import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'

//configuracion de rutas
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //rutas publicas
    {path: '/', name: 'home', component:HomeView},
    {path: '/login', name: 'login', component:LoginView},
    { path: '/register', name: 'register', component: RegisterView },

    //ruta de perfil protegida, solo requiere un usuario logeado
    { 
      path: '/perfil', 
      name: 'profile', 
      component: ProfileView, 
      meta: { requiereAuth: true } 
    },

    //rutas del administrador (protegidas)
    {
      path: '/admin/management',
      name : 'management',
      component: ManagementView,
      meta :{requiereAuth: true, requiereAdmin: true}
    },
    {
      path: '/admin/dashboard',
      name : 'dashboard',
      component : DashboardView,
      meta : {requiereAuth: true, requiereAdmin: true}
    },


    //rutas de jugadores (childs) (protegidas por nivel/edad)
    {
      path : '/juego/nivel-1',
      name : 'level1',
      component : Level1View,
      meta : {requiereAuth:true, nivelRequerido: 1}
    },
    { 
      path: '/juego/nivel-2', 
      name: 'level2', 
      component: Level2View,
      meta: { requiereAuth: true, nivelRequerido: 2 } 
    },
    { 
      path: '/juego/nivel-3', 
      name: 'level3', 
      component: Level3View,
      meta: { requiereAuth: true, nivelRequerido: 3 } 
    },
    { 
      path: '/juego/nivel-4', 
      name: 'level4', 
      component: Level4View,
      meta: { requiereAuth: true, nivelRequerido: 4 } 
    }

  ],
});

//guards seguridad global

/*
  destino: a donde quiere ir el usuario
  

*/
router.beforeEach((destino) =>{

  //instancia del store de autenticacion para obtener los datos en tiempo actual del usuario
  const authStore = useAuthStore();

  // 1 ¿La ruta a la que va requiere estar logueado, pero NO está autenticado?
  if (destino.meta.requiereAuth && !authStore.estaAutenticado) {
    // Bloqueamos el paso y lo redirigimos a la pantalla de Login
    return { name: 'login' };
  }

  // 2 ¿La ruta requiere ser Administrador, pero el usuario NO lo es?
  if (destino.meta.requiereAdmin && !authStore.esAdmin) {
    // Lo sacamos de ahí y lo mandamos al Home público
    return { name: 'home' };
  }

 // 3 ¿La ruta pide un nivel específico (niños) y el usuario NO es admin y no coincide su nivel?
  if (!authStore.esAdmin && destino.meta.nivelRequerido && authStore.nivelUsuario !== destino.meta.nivelRequerido) {
    // Si un niño de nivel 1 intenta entrar al nivel 4, lo obligamos a ir a SU nivel
    return { name: `level${authStore.nivelUsuario}` }; 
  }

});



export default router
