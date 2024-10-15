import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { Router } from '@angular/router';
import { ServiceUsuarioService } from 'src/app/api/service_usuario/service-usuario.service';
import { ServiceRolService } from 'src/app/api/service_rol/service-rol.service';
import { Rol } from 'src/app/models/rol';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  user: User = {
    id_user:0,
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

  rol : Rol ={
    id: 0,
    nombre: ''
  };

  constructor(private router: Router, private _usuarioService: ServiceUsuarioService, private _rolService : ServiceRolService) { }

  ngOnInit() {
    //Se obtiene el usuario enviado al navegar desde página login hacia home con la función login()
    this.user = this.router.getCurrentNavigation()?.extras?.state?.['usuario'];
    console.log("En perfil-usuario"+JSON.stringify(this.user));
    this.obtenerPerfilUsuario();
    
    
  }

  async obtenerPerfilUsuario(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.user.id_user){
        this._usuarioService.getUsuarioByIdUser(this.user.id_user).subscribe({
          next: (response) => {
            if (response.body != null) {
              this.perfilUsuario = response.body[0];
              this.obtenerRolUsuario();
              resolve();
            } else {
              reject('No se encontró el perfil del usuario');
            }
          },
          error: (err) => reject(err)
        });
      } 
    });
  }

  async obtenerRolUsuario(): Promise<void> {
    if (this.perfilUsuario.ID_rol) {
      this.rol.id = this.perfilUsuario.ID_rol;
      return new Promise((resolve, reject) => {
        if (typeof this.perfilUsuario.ID_rol === "number"){
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
      });
    }
  }

  irHome(){
    this.router.navigate(['home']);
  }
}
