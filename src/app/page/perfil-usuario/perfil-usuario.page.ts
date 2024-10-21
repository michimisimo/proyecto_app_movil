import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { Router } from '@angular/router';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { User } from 'src/app/models/user';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { AuthService } from 'src/app/api/service-auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {
  user: User | null = {
    id_user: 0,
    usuario: '',
    password: '',
  };

  perfilUsuarioMostrar: PerfilUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    id_user: 0,
    id_rol: 0,
  };

  perfilUsuario: PerfilUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    id_user: 0,
    id_rol: 0,
  };

  password: string = '';
  newPassword: string = '';
  repeatNewPassword: string = '';

  isEditing: boolean = false;
  selectedImage: File | null = null;

  constructor(
    private router: Router,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private _userService: ServiceUserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this._perfilUsuarioService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.perfilUsuarioMostrar = usuario;
        this.perfilUsuario = usuario;
      }
      console.log('Usuario en perfil-usuario:', usuario);
    });

    this._userService.user$.subscribe((user) => {
      this.user = user;
      console.log('User en perfil-usuario:', user);
    });
  }

  subirFotoPerfil(event: Event) {
    if (event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            this.selectedImage = target.files[0];
            console.log('Imagen seleccionada:', {
                name: this.selectedImage.name,
                size: this.selectedImage.size,
                type: this.selectedImage.type,
                lastModified: this.selectedImage.lastModified,
            });

            if (this.selectedImage && this.perfilUsuario.id_persona) {
                this._perfilUsuarioService.uploadImage(this.perfilUsuario.id_persona, this.selectedImage).subscribe(
                    (response) => {
                        console.log('Imagen subida con éxito:', response);

                        // Asegúrate de que estás utilizando la propiedad correcta de la respuesta
                        // Ajusta esto según lo que devuelve Supabase
                        if(this.selectedImage){
                          this.perfilUsuario.url_foto = `${environment.storage_url}object/fotos-perfil/perfil-${this.perfilUsuario.id_persona}/${this.selectedImage.name}`;
                        }                        

                        if (this.perfilUsuario.id_persona) {
                            this.updatePerfilUsuario(
                                this.perfilUsuario.id_persona.toString(),
                                this.perfilUsuario
                            );
                        }
                    },
                    (error) => {
                        console.error('Error al subir la imagen:', error);
                    }
                );
            }
        }
    }
}


  updatePerfilUsuario(id: string, data: any) {
    this._perfilUsuarioService.updatePerfilUsuario(id, data).subscribe(
      (response) => {
        console.log('Perfil actualizado con éxito', response);
        this.isEditing = false;
        this._perfilUsuarioService.setPerfilUsuario(this.perfilUsuario);
      },
      (error) => {
        console.error('Error al actualizar el perfil', error);
      }
    );
  }

  limpiar() {
    this.password = '';
    this.newPassword = '';
    this.repeatNewPassword = '';
  }

  cambiarPassword() {
    const hashedCurrentPassword = this.authService.encryptPassword(
      this.password
    );
    console.log(
      'Contraseña actual ingresada encriptada:',
      hashedCurrentPassword
    );

    if (this.user && hashedCurrentPassword === this.user.password) {
      console.log('La contraseña actual ingresada es correcta');

      if (this.newPassword === this.repeatNewPassword) {
        console.log('Las nuevas contraseñas coinciden');

        const hashedNewPassword = this.authService.encryptPassword(
          this.newPassword
        );
        console.log(
          'Contraseña nueva ingresada encriptada:',
          hashedNewPassword
        );
        this.user.password = hashedNewPassword;

        if (this.user.id_user) {
          this._userService
            .updateUserPassword(this.user.id_user.toString(), {
              password: this.user.password,
            })
            .subscribe(
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
          console.log('El ID de usuario no está definido');
        }
      } else {
        console.log('Las nuevas contraseñas no coinciden');
      }
    } else {
      console.log('La contraseña actual ingresada es incorrecta');
    }
  }

  irHome() {
    this.router.navigate(['home']);
  }

  openEditForm() {
    this.isEditing = !this.isEditing;
  }

  actualizarPerfil() {
    console.log(
      'Perfil usuario con datos nuevos: ',
      JSON.stringify(this.perfilUsuario)
    );

    if (this.perfilUsuario.id_persona) {
      const id = this.perfilUsuario.id_persona.toString();

      this._perfilUsuarioService
        .updatePerfilUsuario(id, this.perfilUsuario)
        .subscribe(
          (response) => {
            console.log('Perfil actualizado con éxito', response);
            this.isEditing = false;
            this._perfilUsuarioService.setPerfilUsuario(this.perfilUsuario);
          },
          (error) => {
            console.error('Error al actualizar el perfil', error);
          }
        );
    } else {
      console.log('El ID de perfil no está definido');
    }
  }
}
