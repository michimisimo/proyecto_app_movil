import { Component } from '@angular/core';
import { AuthService } from 'src/app/api/service-auth/auth.service';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { User } from 'src/app/models/user';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ErrorPerfilUsuario } from 'src/app/models/error-perfil-usuario';
import { validarPerfilUsuario } from 'src/app/utils/validacion/valid-registro';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';


@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  user: User = {
    usuario: '',
    password: ''
  }

  createUser: User = {
    usuario: '',
    password: ''
  }

  perfilUsuario: PerfilUsuario = {
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    id_user: 0
  }

  usersList: User[] = []

  error: ErrorPerfilUsuario = {};

  passwordConfirm: String = "";

  constructor(private authService: AuthService,
    private _userService: ServiceUserService,
    private router: Router,
    private alertController: AlertController,
    private _perfilUsuarioService: ServicePerfilUsuarioService) { }

  ngOnInit(): void {
    this.limpiar();
  }

  limpiar() {
    this.perfilUsuario.nombre = "";
    this.perfilUsuario.apellido = "";
    this.perfilUsuario.correo = "";
    this.perfilUsuario.telefono = "";
    this.user.password = "";
    this.user.usuario = "";
    this.passwordConfirm = "";
  }

  //Crear el popup de error para la validación de campos
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  registrar() {
    // Selección de inputs por nombre
    const inputUsuario = document.getElementsByName('username')[0] as HTMLInputElement;
    const inputPassword = document.getElementsByName('password')[0] as HTMLInputElement;
    const inputPassConfirm = document.getElementsByName('confirmPassword')[0] as HTMLInputElement;
    const inputNombre = document.getElementsByName('firstName')[0] as HTMLInputElement;
    const inputApellido = document.getElementsByName('lastName')[0] as HTMLInputElement;
    const inputCorreo = document.getElementsByName('email')[0] as HTMLInputElement;
    const inputTelefono = document.getElementsByName('phone')[0] as HTMLInputElement;

    // Asignar usuario y contraseña al objeto User
    this.user.usuario = inputUsuario.value;
    this.user.password = inputPassword.value; // Se encriptará más adelante

    // Asignar otros datos al objeto PerfilUsuario
    this.perfilUsuario.nombre = inputNombre.value;
    this.perfilUsuario.apellido = inputApellido.value;
    this.perfilUsuario.telefono = inputTelefono.value;
    this.perfilUsuario.correo = inputCorreo.value;

    // Obtener error
    this.error = validarPerfilUsuario(this.user, this.perfilUsuario, this.passwordConfirm, inputUsuario, inputPassword, inputPassConfirm, inputNombre, inputApellido, inputCorreo, inputTelefono);

    if (Object.keys(this.error).length > 0) {
      console.log("Errores encontrados:", this.error);
      this.showAlert('ERROR', 'Por favor, corrige los errores antes de continuar.');
      return;
    }

    // Encriptar la contraseña
    const hashedPassword = this.authService.encryptPassword(this.user.password);
    console.log('Contraseña encriptada:', hashedPassword);
    this.createUser.password = hashedPassword;

    // Subir el usuario, rol y perfil a la base de datos
    this.createUser.usuario = this.user.usuario;
    this._userService.createUser(this.createUser).subscribe({
      next: (userResponse) => {
        console.log('Usuario creado:', userResponse);

        // Obtener ID del usuario recién creado
        this._userService.getUsers().subscribe({
          next: response => {
            if (response.body !== null) {
              this.usersList = response.body;
              const userId = this.usersList[this.usersList.length - 1].id_user;
              this.perfilUsuario.id_user = userId;
              console.log("Después de obtener el ID" + JSON.stringify(this.perfilUsuario));

              // Subir perfil de usuario a la BD
              console.log("Antes de POST " + JSON.stringify(this.perfilUsuario));
              this._perfilUsuarioService.createPerfilUsuario(this.perfilUsuario).subscribe({
                next: (perfilResponse) => {
                  console.log('Perfil de usuario creado:', perfilResponse);
                  // Redirigir al usuario a la página de login
                  this.limpiar();
                  this.router.navigate(['login']);
                },
                error: (error) => {
                  console.error('Error al crear perfil de usuario:', error);
                  this.showAlert('ERROR', 'Error al crear el perfil de usuario. Inténtalo nuevamente.');
                }
              });
            }
          },
          error: (error) => {
            console.error('Error al obtener el usuario:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al crear rol:', error);
        this.showAlert('ERROR', 'Error al crear el rol del usuario. Inténtalo nuevamente.');
      }
    });
  }


  irLogin() {
    this.router.navigate(['login']);
  }
}