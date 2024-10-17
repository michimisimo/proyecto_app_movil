import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Amistad } from 'src/app/models/amistad';

@Injectable({
  providedIn: 'root'
})
export class ServiceAmigosService {

  constructor(private apiService: ServiceApiConfigService) { }

  getAmigo(): Observable<HttpResponse<Amistad[]>> {
    return this.apiService.get<Amistad[]>('amistad'); // Llama al método get del servicio de configuración
  }

  getAmigoById(id: number): Observable<HttpResponse<Amistad[]>> {
    return this.apiService.get<Amistad[]>(`amistad?id=eq.${id}&select=*`); // Llama al método get para un amigo específico
  }

  createAmigo(data: any): Observable<HttpResponse<any>> {
    return this.apiService.post('amistad', data); // Llama al método post para crear un nuevo amigo
  }

  updateAmigo(id: string, data: any): Observable<HttpResponse<any>> {
    return this.apiService.patch(`amistad/${id}`, data); // Llama al método patch para actualizar un amigo
  }

  deleteAmigo(id: string): Observable<HttpResponse<any>> {
    return this.apiService.delete(`amistad/${id}`); // Llama al método delete para eliminar un amigo
  }
}
