import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from 'src/app/models/evento';

@Injectable({
  providedIn: 'root'
})
export class ServiceEventoService {

  constructor(private apiService: ServiceApiConfigService) { }

  // Buscar todos los eventos
  getEventos(): Observable<HttpResponse<Evento[]>> {
    return this.apiService.get<Evento[]>('evento'); // Llama al método get del servicio de configuración
  }

  // Buscar evento por ID
  getEventoById(id: number): Observable<HttpResponse<Evento[]>> {
    return this.apiService.get<Evento[]>(`evento?id_evento=eq.${id}&select=*`); // Llama al método get para un evento específico
  }

  // Buscar evento por ID
  getEventoByIdCreador(id: number): Observable<HttpResponse<Evento[]>> {
    return this.apiService.get<Evento[]>(`evento?id_creador=eq.${id}&select=*`); // Llama al método get para un evento específico
  }

  // Crear un nuevo evento
  createEvento(data: Evento): Observable<HttpResponse<Evento>> {
    return this.apiService.post<Evento>('evento', data); // Llama al método post para crear un nuevo evento
  }

  // Actualizar un evento existente
  updateEvento(id: string, data: Evento): Observable<HttpResponse<Evento>> {
    return this.apiService.patch<Evento>(`evento?id_evento=eq.${id}`, data); // Llama al método patch para actualizar un evento
  }

  // Eliminar un evento
  deleteEvento(id: number): Observable<HttpResponse<any>> {
    return this.apiService.delete(`evento/${id}`); // Llama al método delete para eliminar un evento
  }
}
