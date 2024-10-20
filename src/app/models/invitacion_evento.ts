export interface InvitacionEvento {
    id_invitacion: number;
    id_invitado: number;
    id_evento: number;
    id_rol: number;
    id_estado: number;
    fecha_invitacion?: Date;
    fecha_respuesta?: Date;
}