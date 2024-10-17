import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { Router } from '@angular/router';
import { ServiceUsuarioService } from 'src/app/api/service_usuario/service-usuario.service';
import { ServiceRolService } from 'src/app/api/service_rol/service-rol.service';
import { Rol } from 'src/app/models/rol';
import { User } from 'src/app/models/user';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  user: User | null = {
    id_user: 0,
    usuario: '',
    password: ''
  };

  perfilUsuario: PerfilUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    id_user: 0,
    ID_rol: 0
  };

  rol: Rol = {
    id: 0,
    nombre: ''
  };


  constructor(private router: Router, private _usuarioService: ServiceUsuarioService, private _rolService: ServiceRolService, private _userService: ServiceUserService) { }

  ngOnInit() {
    //Se obtiene el user seteado en el User Service
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('Usuario en perfil-usuario:', this.user);
    });
    //Se obtiene el usuario seteado en el Usuario Service
    this._usuarioService.usuario$.subscribe(usuario => {
      if(usuario){
        this.perfilUsuario = usuario;
      }      
      console.log('Usuario en perfil-usuario:', this.perfilUsuario);
    });
    this.obtenerRolUsuario();
  }

  async obtenerRolUsuario(): Promise<void> {
    if (this.perfilUsuario && this.perfilUsuario.ID_rol) {
      this.rol.id = this.perfilUsuario.ID_rol;
      return new Promise((resolve, reject) => {
        if (this.perfilUsuario) {
          if (typeof this.perfilUsuario.ID_rol === "number") {
            this._rolService.getRolById(this.perfilUsuario.ID_rol).subscribe({
              next: (response) => {
                if (response.body != null) {
                  this.rol = response.body[0];
                  console.log("Nombre rol: " + this.rol.nombre);
                  resolve();
                } else {
                  reject('No se encontró el rol del usuario');
                }
              },
              error: (err) => reject(err)
            });
          }
        }
      });
    }
  }

  irHome() {
    this.router.navigate(['home']);
  }
}
