import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from 'src/app/models/rol';

@Injectable({
  providedIn: 'root'
})
export class ServiceRolService {

  constructor(private apiService: ServiceApiConfigService) { }

  //buscar rol
  getRol(): Observable<HttpResponse<any>> {
    return this.apiService.get('rol'); // Llama al método get del servicio de configuración
  }

  getRolById(id: number): Observable<HttpResponse<Rol[]>> {
    return this.apiService.get<Rol[]>(`rol?id=eq.${id}&select=*`); // Llama al método get para un rol específico
  }

  createRol(data: any): Observable<HttpResponse<any>> {
    return this.apiService.post('rol', data); // Llama al método post para crear un nuevo usuario
  }

  updateRol(id: string, data: any): Observable<HttpResponse<any>> {
    return this.apiService.patch(`rol/${id}`, data); // Llama al método patch para actualizar un usuario
  }

  deleterRol(id: string): Observable<HttpResponse<any>> {
    return this.apiService.delete(`rol/${id}`); // Llama al método delete para eliminar un usuario
  }
}
