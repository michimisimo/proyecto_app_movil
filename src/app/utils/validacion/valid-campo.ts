import { ErrorPerfilUsuario } from "src/app/models/error-perfil-usuario";
import { PerfilUsuario } from "src/app/models/perfil-usuario";

// Función para aplicar o quitar clases de error
export function aplicarEstilos (input: HTMLInputElement, errorMsg: string, esError: boolean) {
    if (esError) {
      input.classList.add('borde_rojo');
      input.classList.remove('sin_borde');
    } else {
      input.classList.add('sin_borde');
      input.classList.remove('borde_rojo');
    }
  };

export function validarCampoVacio(campo:String, perfilUsuario: PerfilUsuario, error: ErrorPerfilUsuario, input: HTMLInputElement){
if (campo=="nombre"){
    if (perfilUsuario.nombre === "") {
    error.nombre = "Ingrese su nombre";
    aplicarEstilos(input, error.nombre, true);
    } else {
    aplicarEstilos(input, '', false);
    }
}
if (campo=="apellido"){
    if (perfilUsuario.apellido === "") {
    error.apellido = "Ingrese su apellido";
    aplicarEstilos(input, error.apellido, true);
    } else {
    aplicarEstilos(input, '', false);
    }
}
else{
    console.info("Correcto. Los campos nombre y apellidos están llenos.")
}
}