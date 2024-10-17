export interface CompraEvento {
    ID_compra: number;
    descripcion: string;
    costo: number;
    pagado: boolean;
    url_boleta: string;
    fecha_compra: Date;
    fecha_pagado: Date;
    ID_comprador: number;
    ID_lista_compra_evento: number
}