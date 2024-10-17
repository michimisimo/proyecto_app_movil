export interface Evento {
    ID_evento: number;
    nombre: string;
    descripcion: string;
    fecha: Date;
    ubicacion: string;
    ID_creador: number;
    ID_lista_invitados: number;
}