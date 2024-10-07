import { Component } from '@angular/core';
import { AuthService } from 'src/app/api/service-auth/auth.service';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { ServiceUserService } from 'src/app/api/service-user/service-user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ErrorPerfilUsuario } from 'src/app/models/error-perfil-usuario';
import { validarPerfilUsuario} from 'src/app/utils/validacion/valid-registro';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  perfilUsuario: PerfilUsuario = {
    user: {
      usuario: "",
      password: ""
    },
    rol: {
      id: 2,
      nombre: "Invitado" //El registro por defecto crea usuarios con rol invitado
    },
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  }

  error: ErrorPerfilUsuario = {};

  passwordConfirm: String = "";

  constructor(private authService: AuthService, private _userService: ServiceUserService, private router: Router, private alertController: AlertController) { }

  ngOnInit(): void{
    this.limpiar();
  }

  limpiar() {
    this.perfilUsuario.nombre = "";
    this.perfilUsuario.apellido = "";
    this.perfilUsuario.correo = "";
    this.perfilUsuario.telefono = "";
    this.perfilUsuario.user.password = "";
    this.perfilUsuario.user.usuario = "";
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

  registrar(perfilUsuario: PerfilUsuario) {
    
    // Selección de inputs por nombre
    const inputUsuario = document.getElementsByName('username')[0] as HTMLInputElement;
    const inputPassword = document.getElementsByName('password')[0] as HTMLInputElement;
    const inputPassConfirm = document.getElementsByName('confirmPassword')[0] as HTMLInputElement;
    const inputNombre = document.getElementsByName('firstName')[0] as HTMLInputElement;
    const inputApellido = document.getElementsByName('lastName')[0] as HTMLInputElement;
    const inputCorreo = document.getElementsByName('email')[0] as HTMLInputElement;
    const inputTelefono = document.getElementsByName('phone')[0] as HTMLInputElement;

    // Obtener error
    this.error = validarPerfilUsuario(this.perfilUsuario, this.passwordConfirm, inputUsuario, inputPassword, inputPassConfirm, inputNombre, inputApellido, inputCorreo, inputTelefono);
    
    if (Object.keys(this.error).length > 0) {
      console.log("Errores encontrados:", this.error);
      this.showAlert('ERROR', 'Por favor, corrige los errores antes de continuar.');
      return;
    }

    // Encriptar la contraseña
    const hashedPassword = this.authService.encryptPassword(this.perfilUsuario.user.password);
    console.log('Contraseña encriptada:', hashedPassword);
    this.perfilUsuario.user.password = hashedPassword;

    // Agregar el usuario a la lista de usuarios
    this._userService.agregar_usuario(this.perfilUsuario);
    this.router.navigate(['login']);
  }

  irLogin(){
    this.router.navigate(['login']);
  }
}