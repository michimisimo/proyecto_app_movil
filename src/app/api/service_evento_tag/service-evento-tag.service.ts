import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { Observable } from 'rxjs';
import { TagEvento } from 'src/app/models/tag_evento';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceEventoTagService {

  constructor(private apiService: ServiceApiConfigService) { }

  // Buscar todos los eventos
  getTagEvento(): Observable<HttpResponse<TagEvento[]>> {
    return this.apiService.get<TagEvento[]>('evento_tag'); // Llama al método get del servicio de configuración
  }

  // Buscar evento por ID
  getTagEventoById(id: number): Observable<HttpResponse<TagEvento[]>> {
    return this.apiService.get<TagEvento[]>(`evento_tag?id_evento_tag=eq.${id}&select=*`); // Llama al método get para un evento específico
  }

  // Buscar evento por ID
  getTagsByEvento(id: number): Observable<HttpResponse<TagEvento[]>> {
    return this.apiService.get<TagEvento[]>(`evento_tag?id_evento=eq.${id}&select=*`); // Llama al método get para un evento específico
  }

  // Eliminar un evento
  deleteTagEvento(id: number): Observable<HttpResponse<any>> {
    return this.apiService.delete(`evento_tag?id_evento_tag=eq.${id}`); // Llama al método delete para eliminar un evento
  }

  // Crear un nuevo tag
  createTagEvento(data: any): Observable<HttpResponse<any>> {
    return this.apiService.post('evento_tag', data);
  }
}
