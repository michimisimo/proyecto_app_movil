import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { AuthService } from 'src/app/api/service-auth/auth.service';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  user: User = {
    usuario: '',
    password: ''
  };

  usuario: PerfilUsuario = {
    nombre: '',
    correo: '',
    apellido: '',
    telefono: ''
  };

  constructor(
    private _userService: ServiceUserService,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private _perfilUsuarioService: ServicePerfilUsuarioService
  ) { }

  ngOnInit() {
    this.limpiar();
  }

  // Función para limpiar los campos
  limpiar() {
    this.user.password = "";
    this.user.usuario = "";
  }

  // Se crea el popup de error usuario no existe
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }


  // Método para iniciar sesión
  login(usuario: string, password: string) {
    const hashedPassword = this.hash(password); // Encripta la contraseña
    this._userService.login(usuario).subscribe({
      next: (response) => {
        const user = response.body[0];
        if (hashedPassword == user.password) {
          if (user.id_user) {
            // Se establece el user con setUser() en el User Service
            this._userService.setUser(user);
            // Redireccionar a la página home
            this.router.navigate(['home']);
          } else {
            console.error("El usuario no existe")
            this.showAlert("Error", "Vuelva a ingresar usuario y contraseña")//usuario no existe
            this.limpiar();
          }
        } else {
          console.error("Contraseña no coincide")
          this.showAlert("Error", "Vuelva a ingresar usuario y contraseña")//contraseña no coincide
          this.limpiar();
        }
      },
      error: (err) => {
        console.error("Error en la solicitud", err);
        this.showAlert("Error", "Ocurrió un problema al iniciar sesión. Intente nuevamente más tarde.");
      }
    })
  };

  //encriptar contraseña 
  hash(password: string) {
    const hashedPassword = this.authService.encryptPassword(password);
    console.log('Contraseña encriptada:', hashedPassword);
    return password = hashedPassword;
  }

  irRegistro() {
    this.router.navigate(['registro']);
  }

}
