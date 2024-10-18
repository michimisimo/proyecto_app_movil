export interface SolicitudAmistad{
    id_solicitud?: number;
    id_estado: number;
    id_solicitante: number;
    id_destinatario: number;
    fecha_solicitud: Date;
    fecha_respuesta?: Date;
}