import { ErrorPerfilUsuario } from "src/app/models/error-perfil-usuario";
import { PerfilUsuario } from "src/app/models/perfil-usuario";
import { aplicarEstilos} from 'src/app/utils/validacion/valid-campo';

export function validarFormatoCorreo (perfilUsuario: PerfilUsuario, error: ErrorPerfilUsuario, inputCorreo: HTMLInputElement){
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfilUsuario.correo)) {
        error.correo = "Correo electrónico no válido.";
        aplicarEstilos(inputCorreo, error.correo, true);
    } else {
        aplicarEstilos(inputCorreo, '', false);
    }
}

export function validarLongitudPassword(perfilUsuario:PerfilUsuario, error:ErrorPerfilUsuario, inputPassword:HTMLInputElement, inputPassConfirm:HTMLInputElement){
    if (perfilUsuario.user.password.length < 8) {
        error.password = "La contraseña debe tener al menos 8 caracteres";
        aplicarEstilos(inputPassword, error.password, true);
        // La contraseña de confirmación debe también tener borde rojo y placeholder vacío
        aplicarEstilos(inputPassConfirm, '', true);
        return false;
    }
    else{
        console.info("Correcto. La contraseña tiene una longitud válida.")
        return true;
    }
}

export function validarFormatoTelefono(perfilUsuario:PerfilUsuario, error:ErrorPerfilUsuario, inputTelefono: HTMLInputElement){
    if (perfilUsuario.telefono.length !== 9) {
        error.telefono = "El teléfono debe contener 9 dígitos";
        aplicarEstilos(inputTelefono, error.telefono, true);
    } else {
        aplicarEstilos(inputTelefono, '', false);
    }
}

export function validarCoincidenciaPasswords(perfilUsuario: PerfilUsuario, error: ErrorPerfilUsuario, inputPassword:HTMLInputElement, inputPassConfirm: HTMLInputElement, passwordConfirm: String){
    if (perfilUsuario.user.password !== passwordConfirm) {
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
