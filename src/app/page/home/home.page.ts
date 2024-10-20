import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User | null = {
    id_user: 0,
    usuario: '',
    password: ''
  };

  perfilUsuario: PerfilUsuario | null = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  }

  constructor(
    private _userService: ServiceUserService, 
    private _perfilUsuarioService : ServicePerfilUsuarioService, 
    private router : Router) { }

  ngOnInit() {
    // Se obtiene el user seteado en el User Service
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('User en home:', this.user);
    });
    this.obtenerPerfilUsuario();
  }

  async obtenerPerfilUsuario(): Promise<void> {
    if (this.user != null && this.user.id_user) {
      try {
        const response = await this._perfilUsuarioService.getPerfilUsuarioByIdUser(this.user.id_user).toPromise();
        if (response && response.body != null) {
          this.perfilUsuario = response.body[0];
          this._perfilUsuarioService.setPerfilUsuario(this.perfilUsuario);          
        } else {
          throw new Error('No se encontró el perfil del usuario');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No se encontró el user");
    }
  }

  irCrearEvento() {
    this.router.navigate(['crear-evento']);
  }

}
