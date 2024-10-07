import { ErrorPerfilUsuario } from "src/app/models/error-perfil-usuario";
import { PerfilUsuario } from "src/app/models/perfil-usuario";
import { aplicarEstilos} from 'src/app/utils/validacion/valid-campo';

export function validarLongitudUsuario(usuario:string, error: ErrorPerfilUsuario, inputUsuario: HTMLInputElement){
    if (usuario.length < 4) {
      error.usuario = "Ingrese un usuario de más de 4 caracteres";
      aplicarEstilos(inputUsuario, error.usuario, true);
    } else {
      aplicarEstilos(inputUsuario, '', false);
    }
  }

export function validarLongitudPassword(password:string, error:ErrorPerfilUsuario, inputPassword:HTMLInputElement, inputPassConfirm?:HTMLInputElement){
    if (password.length < 8) {
        error.password = "La contraseña debe tener al menos 8 caracteres";
        aplicarEstilos(inputPassword, error.password, true);
        // La contraseña de confirmación debe también tener borde rojo y placeholder vacío
        //inputPassConfirm es parámetro opcional para poder validar el largo en otro formulario sin confirmación de password
        if (inputPassConfirm !== undefined){
            aplicarEstilos(inputPassConfirm, '', true);
        }
        return false;
    }
    else{
        console.info("Correcto. La contraseña tiene una longitud válida.")
        return true;
    }
}

export function validarCoincidenciaPasswords(password: string, error: ErrorPerfilUsuario, inputPassword:HTMLInputElement, inputPassConfirm: HTMLInputElement, passwordConfirm: String){
    if (password !== passwordConfirm) {
        // Verifica coincidencia de contraseñas
        error.password_match = "Las contraseñas no coinciden.";
        aplicarEstilos(inputPassword, '', false);
        aplicarEstilos(inputPassConfirm, error.password_match, true);
        return false;
    }else{
        console.info("Correcto. Las contraseñas coinciden")
        return true;
    }
}

export function validarFormatoCorreo (correo:string, error: ErrorPerfilUsuario, inputCorreo: HTMLInputElement){
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        error.correo = "Correo electrónico no válido.";
        aplicarEstilos(inputCorreo, error.correo, true);
    } else {
        aplicarEstilos(inputCorreo, '', false);
    }
}

export function validarFormatoTelefono(telefono:string, error:ErrorPerfilUsuario, inputTelefono: HTMLInputElement){
    if (telefono.length !== 9) {
        error.telefono = "El teléfono debe contener 9 dígitos";
        aplicarEstilos(inputTelefono, error.telefono, true);
    } else {
        aplicarEstilos(inputTelefono, '', false);
    }
}