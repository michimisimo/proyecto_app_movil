import { PerfilUsuario } from "src/app/models/perfil-usuario";
import { ErrorPerfilUsuario } from "src/app/models/error-perfil-usuario";
import { aplicarEstilos} from 'src/app/utils/validacion/valid-campo';
import { validarCampoVacio} from 'src/app/utils/validacion/valid-campo';
import { validarLongitudPassword} from 'src/app/utils/validacion/valid-user';
import { validarFormatoCorreo} from 'src/app/utils/validacion/valid-user';
import { validarFormatoTelefono} from 'src/app/utils/validacion/valid-user';
import { validarCoincidenciaPasswords} from 'src/app/utils/validacion/valid-user';

export function validarLongitudUsuario(perfilUsuario: PerfilUsuario, error: ErrorPerfilUsuario, inputUsuario: HTMLInputElement){
  if (perfilUsuario.user.usuario.length < 4 || perfilUsuario.user.usuario.length > 20) {
    error.usuario = "Ingrese un usuario de 4 a 20 caracteres";
    aplicarEstilos(inputUsuario, error.usuario, true);
  } else {
    aplicarEstilos(inputUsuario, '', false);
  }
}

export function validarPerfilUsuario (perfilUsuario: PerfilUsuario, passwordConfirm: String, inputUsuario: HTMLInputElement, 
  inputPassword: HTMLInputElement, inputPassConfirm: HTMLInputElement, inputNombre: HTMLInputElement, inputApellido: HTMLInputElement,
  inputCorreo: HTMLInputElement, inputTelefono: HTMLInputElement) : ErrorPerfilUsuario{
  const error: ErrorPerfilUsuario = {}; // Reiniciar errores antes de la validación

  //Estas funciones aplican estilos (borde rojo o sin borde) 
  //Muestran mensajes de error en caso de no cumplir con las validaciones
  validarLongitudUsuario(perfilUsuario, error, inputUsuario);
  validarCampoVacio("nombre",perfilUsuario, error, inputNombre);
  validarCampoVacio("apellido",perfilUsuario, error, inputApellido);
  
  //Validar longitud mínima de la contraseña
  const retornoLargo = validarLongitudPassword(perfilUsuario, error, inputPassword, inputPassConfirm);
  //validar coincidencia entre constraseña y confirmar contraseña
  const retornoCoincidencia = validarCoincidenciaPasswords(perfilUsuario, error, inputPassword, inputPassConfirm, passwordConfirm);
  
  //Dejar campos contraseña y confirmar contraseña sin borde rojo (aprobados) si en ambas validaciones cumplen con requisitos
  if (retornoLargo && retornoCoincidencia){
    aplicarEstilos(inputPassword, '', false);
    aplicarEstilos(inputPassConfirm, '', false);
  }

  // Verifica formato del correo electrónico
  validarFormatoCorreo(perfilUsuario, error, inputCorreo);

  // Verifica que el teléfono contenga solo caracteres numéricos y tenga exactamente 9 dígitos
  validarFormatoTelefono(perfilUsuario, error, inputTelefono);

  return error;
};