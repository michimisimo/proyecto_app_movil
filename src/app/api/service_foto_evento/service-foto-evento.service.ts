import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FotoEvento } from 'src/app/models/foto_evento';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceFotoEventoService {
  constructor(private apiService: ServiceApiConfigService) {}

  // Buscar todas las fotos de evento
  getFotoEvento(): Observable<HttpResponse<FotoEvento[]>> {
    return this.apiService.get<FotoEvento[]>('foto_evento'); // Llama al método get del servicio de configuración
  }

  // Buscar foto de evento por ID
  getFotoEventoById(id: number): Observable<HttpResponse<FotoEvento>> {
    return this.apiService.get<FotoEvento>(
      `foto_evento?id_foto_evento=eq.${id}&select=*`
    ); // Llama al método get para una foto de evento específica
  }

  // Buscar fotos de evento por ID del creador
  getFotoEventoByIdEvento(id: number): Observable<HttpResponse<FotoEvento[]>> {
    return this.apiService.get<FotoEvento[]>(
      `foto_evento?id_evento=eq.${id}&select=*`
    ); // Llama al método get para fotos de evento específicas
  }

  // Crear una nueva foto de evento
  createFotoEvento(data: FotoEvento): Observable<HttpResponse<FotoEvento>> {
    return this.apiService.post<FotoEvento>('foto_evento', data); // Llama al método post para crear una nueva foto de evento
  }

  // Actualizar una foto de evento existente
  updateFotoEvento(
    id: number,
    data: FotoEvento
  ): Observable<HttpResponse<any>> {
    return this.apiService.patch(`foto_evento/${id}`, data); // Llama al método patch para actualizar una foto de evento
  }

  // Eliminar una foto de evento
  deleteFotoEvento(id: number): Observable<HttpResponse<any>> {
    return this.apiService.delete(`foto_evento/${id}`); // Llama al método delete para eliminar una foto de evento
  }
}
