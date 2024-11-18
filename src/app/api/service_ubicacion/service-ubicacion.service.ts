import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from 'src/app/models/ubicacion';

@Injectable({
  providedIn: 'root'
})
export class ServiceUbicacionService {

  constructor(private apiService: ServiceApiConfigService) { }

  // Buscar Ubicacion por ID
  getUbicacionById(id: number): Observable<HttpResponse<Ubicacion[]>> {
    return this.apiService.get<Ubicacion[]>(`ubicacion?id_ubicacion=eq.${id}&select=*`); // Llama al método get para una Ubicacion específico
  }

  // Crear una nueva Ubicacion
  createUbicacion(data: Ubicacion): Observable<HttpResponse<Ubicacion>> {
    return this.apiService.post<Ubicacion>('ubicacion', data); // Llama al método post para crear una nueva Ubicacion
  }

  // Actualizar una Ubicacion existente
  updateUbicacion(id: number, data: Ubicacion): Observable<HttpResponse<Ubicacion>> {
    return this.apiService.patch<Ubicacion>(`ubicacion?id_ubicacion=eq.${id}`, data); // Llama al método patch para actualizar una Ubicacion
  }

  // Eliminar una Ubicacion
  deleteUbicacion(id: number): Observable<HttpResponse<any>> {
    return this.apiService.delete(`ubicacion/${id}`); // Llama al método delete para eliminar una Ubicacion
  }

  getIdUbicacion(direccion: string, latitud: number, longitud: number): Observable<HttpResponse<Ubicacion[]>> {
    return this.apiService.get<Ubicacion[]>(`ubicacion?direccion=eq.${direccion}&latitud=eq.${latitud}&longitud=eq.${longitud}&select=*`);
  }
}
