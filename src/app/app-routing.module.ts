import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { isAdminGuard } from './guards/isAdmin/is-admin.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./page/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./page/registro/registro.module').then(
        (m) => m.RegistroPageModule
      ),
  },
  {
    path: 'perfil-usuario',
    loadChildren: () =>
      import('./page/perfil-usuario/perfil-usuario.module').then(
        m => m.PerfilUsuarioPageModule)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./page/home/home.module').then(
        m => m.HomePageModule)
  },
  {
    path: 'contactos',
    loadChildren: () => import('./page/contactos/contactos.module').then( m => m.ContactosPageModule)
  },
  {
    path: 'crear-evento',
    loadChildren: () => import('./page/crear-evento/crear-evento.module').then( m => m.CrearEventoPageModule)
  },
  {
    path: 'mis-eventos',
    loadChildren: () => import('./page/mis-eventos/mis-eventos.module').then( m => m.MisEventosPageModule)
  },
  {
    path: 'evento',
    loadChildren: () => import('./page/evento/evento.module').then( m => m.EventoPageModule)
  },
  {
    path: 'galeria-evento',
    loadChildren: () => import('./page/galeria-evento/galeria-evento.module').then( m => m.GaleriaEventoPageModule)
  },
  {
    path: 'editar-evento',
    loadChildren: () => import('./page/editar-evento/editar-evento.module').then( m => m.EditarEventoPageModule),
    canActivate: [isAdminGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
