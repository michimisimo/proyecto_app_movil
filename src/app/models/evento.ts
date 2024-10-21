export interface Evento {
    id_evento?: number;
    nombre: string;
    descripcion: string;
    fecha: Date;
    ubicacion: string;
    id_creador: number;
    url_foto_portada?: string | null;
}