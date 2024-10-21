export interface PerfilUsuario {
    nombre: string;
    correo: string,
    apellido: string;
    telefono: string;
    id_user?: number;
    id_rol?: number;
    id_persona?: number;
    url_foto?: string | null;
}