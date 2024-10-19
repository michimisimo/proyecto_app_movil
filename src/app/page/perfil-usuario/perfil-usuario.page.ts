import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { Router } from '@angular/router';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { User } from 'src/app/models/user';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { AuthService } from 'src/app/api/service-auth/auth.service';

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
    id_rol: 0
  };

  password: string = '';
  newPassword: string = '';
  repeatNewPassword: string = '';

  constructor(
    private router: Router,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private _userService: ServiceUserService,
    private authService: AuthService) { }

  ngOnInit() {
    //Se obtiene el usuario seteado en el Usuario Service
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.perfilUsuario = usuario;
      }
      console.log('Usuario en perfil-usuario:', this.perfilUsuario);
    });
    // Se obtiene el user seteado en el User Service
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('User en perfil-usuario:', this.user);
    });
  }

  limpiar() {
    this.password = '';
    this.newPassword = '';
    this.repeatNewPassword = '';
  }

  cambiarPassword() {
    const hashedCurrentPassword = this.authService.encryptPassword(this.password);
    console.log('Contraseña actual ingresada encriptada:', hashedCurrentPassword);

    if (this.user && hashedCurrentPassword === this.user.password) {
        console.log("La contraseña actual ingresada es correcta");

        if (this.newPassword === this.repeatNewPassword) {
            console.log("Las nuevas contraseñas coinciden");

            const hashedNewPassword = this.authService.encryptPassword(this.newPassword);
            console.log('Contraseña nueva ingresada encriptada:', hashedNewPassword);
            this.user.password = hashedNewPassword;

            if (this.user.id_user) {
                this._userService.updateUserPassword(this.user.id_user.toString(), { password: this.user.password }).subscribe(
                    (response) => {
                        console.log('Usuario actualizado con éxito', response);
                        this.limpiar();
                        this.router.navigate(['login']);
                    },
                    (error) => {
                        console.error('Error al actualizar el usuario', error);
                    }
                );
            } else {
                console.log("El ID de usuario no está definido");
            }
        } else {
            console.log("Las nuevas contraseñas no coinciden");
        }
    } else {
        console.log("La contraseña actual ingresada es incorrecta");
    }
}



  irHome() {
    this.router.navigate(['home']);
  }

}

/* async obtenerRolUsuario(): Promise<void> {
  if (this.perfilUsuario && this.perfilUsuario.id_rol) {
    this.rol.id = this.perfilUsuario.id_rol;
    return new Promise((resolve, reject) => {
      if (this.perfilUsuario) {
        if (typeof this.perfilUsuario.id_rol === "number") {
          this._rolService.getRolById(this.perfilUsuario.id_rol).subscribe({
            next: (response) => {
              if (response.body != null) {
                this.rol = response.body[0];
                console.log("Nombre rol:s " + this.rol.nombre);
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
} */




