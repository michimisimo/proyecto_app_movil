import { Component } from '@angular/core';
import { User } from './models/user';
import { Router } from '@angular/router';
import { ServiceUserService } from './api/service_user/service-user.service';
import { MenuController } from '@ionic/angular';
import { PerfilUsuario } from './models/perfil-usuario';
import { ServicePerfilUsuarioService } from './api/service_perfil_usuario/service-perfil-usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  user: User | null = {
    id_user: 0,
    usuario: '',
    password: ''
  };

  usuario: PerfilUsuario | null = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  }

  constructor(private router: Router, private _userService: ServiceUserService, private menu: MenuController, private _perfilUsuarioService: ServicePerfilUsuarioService) { }

  ngOnInit() {
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('User en app components:', this.user);
    });
    //Se obtiene el usuario seteado en el Usuario Service
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      console.log('Usuario en app components:', this.usuario);
    });
  }

  irVerPerfil() {
    this.menu.close();
    this.router.navigate(['perfil-usuario'])
  }

  irCrearEvento() {
    this.menu.close();
    this.router.navigate(['/crear-evento']);
  }

  irMisEventos() {
    this.menu.close();
    this.router.navigate(['/mis-eventos']); 
  }

  irContactos() {
    this.menu.close();
    this.router.navigate(['contactos'])
  }

  irConfiguracion() {
    this.menu.close();
    //this.router.navigate(['/configuracion']); 
  }

  irAyuda() {
    console.log("TODO VA A ESTAR BIEN <3")
    this.menu.close();
    //this.router.navigate(['/ayuda']); 
  }
}

