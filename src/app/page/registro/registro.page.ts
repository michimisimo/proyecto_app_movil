import { Component } from '@angular/core';
import { AuthService } from 'src/app/api/service-auth/auth.service';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { ServiceUserService } from 'src/app/api/service-user/service-user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ErrorPerfilUsuario } from 'src/app/models/error-perfil-usuario';

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

  //Se crea el popup de error para la validación de campos
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }


  validarPerfilUsuario = (perfilUsuario: PerfilUsuario) => {
    const error: any = {}; // Reiniciar errores antes de la validación

    // Selección de inputs por nombre
    const inputUsuario = document.getElementsByName('username')[0] as HTMLInputElement;
    const inputPassword = document.getElementsByName('password')[0] as HTMLInputElement;
    const inputPassConfirm = document.getElementsByName('confirmPassword')[0] as HTMLInputElement;
    const inputNombre = document.getElementsByName('firstName')[0] as HTMLInputElement;
    const inputApellido = document.getElementsByName('lastName')[0] as HTMLInputElement;
    const inputCorreo = document.getElementsByName('email')[0] as HTMLInputElement;
    const inputTelefono = document.getElementsByName('phone')[0] as HTMLInputElement;

    // Función para aplicar o quitar clases de error
    const aplicarEstilos = (input: HTMLInputElement, errorMsg: string, esError: boolean) => {
      if (esError) {
        input.classList.add('borde_rojo');
        input.classList.remove('sin_borde');
      } else {
        input.classList.add('sin_borde');
        input.classList.remove('borde_rojo');
      }
      // Para el placeholder
      //input.placeholder = esError ? errorMsg : '';
    };

    // Verifica longitud del nombre de usuario
    if (perfilUsuario.user.usuario.length < 4 || perfilUsuario.user.usuario.length > 20) {
      error.usuario = "Ingrese un usuario de 4 a 20 caracteres";
      aplicarEstilos(inputUsuario, error.usuario, true);
    } else {
      aplicarEstilos(inputUsuario, '', false);
    }

    // Verifica si el nombre está vacío
    if (perfilUsuario.nombre === "") {
      error.nombre = "Ingrese su nombre";
      aplicarEstilos(inputNombre, error.nombre, true);
    } else {
      aplicarEstilos(inputNombre, '', false);
    }

    // Verifica si el apellido está vacío
    if (perfilUsuario.apellido === "") {
      error.apellido = "Ingrese su apellido";
      aplicarEstilos(inputApellido, error.apellido, true);
    } else {
      aplicarEstilos(inputApellido, '', false);
    }

    // Verifica la longitud mínima de la contraseña
    if (perfilUsuario.user.password.length < 8) {
      error.password = "La contraseña debe tener al menos 8 caracteres";
      aplicarEstilos(inputPassword, error.password, true);
      // La contraseña de confirmación debe también tener borde rojo y placeholder vacío
      aplicarEstilos(inputPassConfirm, '', true);
    } else if (perfilUsuario.user.password !== this.passwordConfirm) {
      // Verifica coincidencia de contraseñas
      error.password_match = "Las contraseñas no coinciden.";
      aplicarEstilos(inputPassword, '', false);
      aplicarEstilos(inputPassConfirm, error.password_match, true);
    } else {
      aplicarEstilos(inputPassword, '', false);
      aplicarEstilos(inputPassConfirm, '', false);
    }

    // Verifica formato del correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfilUsuario.correo)) {
      error.correo = "Correo electrónico no válido.";
      aplicarEstilos(inputCorreo, error.correo, true);
    } else {
      aplicarEstilos(inputCorreo, '', false);
    }

    // Verifica que el teléfono contenga solo caracteres numéricos y tenga exactamente 9 dígitos
    if (perfilUsuario.telefono.length !== 9) {
      error.telefono = "El teléfono debe contener 9 dígitos";
      aplicarEstilos(inputTelefono, error.telefono, true);
    } else {
      aplicarEstilos(inputTelefono, '', false);
    }

    return error;
  };


  registrar(perfilUsuario: PerfilUsuario) {
    // Actualiza errores
    this.error = this.validarPerfilUsuario(this.perfilUsuario);
    if (Object.keys(this.error).length > 0) {
      console.log("Errores encontrados:", this.error);
      this.showAlert('ERROR', 'Por favor, corrige los errores antes de continuar.');
      return;
    }

    // Encripta la contraseña
    const hashedPassword = this.authService.encryptPassword(this.perfilUsuario.user.password);
    console.log('Contraseña encriptada:', hashedPassword);
    this.perfilUsuario.user.password = hashedPassword;

    // Agrega el usuario a la lista de usuarios
    this._userService.agregar_usuario(this.perfilUsuario);
    this.router.navigate(['login']);
  }

  irLogin(){
    this.router.navigate(['login']);
  }
}

