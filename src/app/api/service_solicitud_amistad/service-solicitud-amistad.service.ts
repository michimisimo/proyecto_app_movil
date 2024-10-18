import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { SolicitudAmistad } from 'src/app/models/solicitud_amistad';




@Injectable({
  providedIn: 'root'
})
export class SolicitudAmistadService {
  constructor(private apiService: ServiceApiConfigService) {}

  // Método para obtener una solicitud de amistad por su ID
  getSolicitudAmistadById(id: number): Observable<HttpResponse<SolicitudAmistad>> {
    return this.apiService.get<SolicitudAmistad>(`solicitud_amistad/${id}`); // Llama al método get para una solicitud específica
  }

  // Método para obtener solicitudes de amistad por ID de usuario
  getSolicitudAmistadByIdUser(id: number): Observable<HttpResponse<SolicitudAmistad[]>> {
    return this.apiService.get<SolicitudAmistad[]>(`solicitud_amistad?id_solicitante=eq.${id}&select=*`); // Llama al método get para solicitudes de un usuario específico
  }

  // Método para obtener todas las solicitudes de amistad
  getSolicitudesAmistad(): Observable<HttpResponse<SolicitudAmistad[]>> {
    return this.apiService.get<SolicitudAmistad[]>('solicitud_amistad'); // Llama al método get del servicio para obtener todas las solicitudes
  }

  // Método para crear una nueva solicitud de amistad
  createSolicitudAmistad(data: any): Observable<HttpResponse<SolicitudAmistad>> {
    return this.apiService.post<SolicitudAmistad>('solicitud_amistad', data); // Llama al método post para crear una nueva solicitud
  }

  // Método para actualizar una solicitud de amistad
  updateSolicitudAmistad(id: string, data: any): Observable<HttpResponse<any>> {
    return this.apiService.patch(`solicitud_amistad/${id}`, data); // Llama al método patch para actualizar una solicitud
  }

  // Método para eliminar una solicitud de amistad
  deleteSolicitudAmistad(id: string): Observable<HttpResponse<any>> {
    return this.apiService.delete(`solicitud_amistad/${id}`); // Llama al método delete para eliminar una solicitud
  }
}
