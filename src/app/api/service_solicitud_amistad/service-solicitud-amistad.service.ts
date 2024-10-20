import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { SolicitudAmistad } from 'src/app/models/solicitud_amistad';




@Injectable({
  providedIn: 'root'
})
export class SolicitudAmistadService {
  constructor(private apiService: ServiceApiConfigService) { }

  // Método para obtener una solicitud de amistad por su ID
  getSolicitudAmistadById(id: number): Observable<HttpResponse<SolicitudAmistad>> {
    return this.apiService.get<SolicitudAmistad>(`solicitud_amistad/${id}`); // Llama al método get para una solicitud específica
  }

  // Método para obtener solicitudes de amistad por ID de usuario
  getSolicitudAmistadByIdUser(id: number): Observable<HttpResponse<SolicitudAmistad[]>> {
    return this.apiService.get<SolicitudAmistad[]>(`solicitud_amistad?or=(id_solicitante.eq.${id},id_destinatario.eq.${id})&select=*`);
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
  updateSolicitudAmistad(id: number, data: any): Observable<HttpResponse<any>> {
    return this.apiService.patch(`solicitud_amistad/${id}`, data);
  }

  // Método para eliminar una solicitud de amistad
  deleteSolicitudAmistad(id: number): Observable<HttpResponse<any>> {
    return this.apiService.delete(`solicitud_amistad?id_solicitud=eq.${id}`); // Llama al método delete para eliminar una solicitud
  }

  updateEstado(id_sol: number, id_dest: number, id_estado: number): Observable<HttpResponse<any>> {
    // Prepara los datos para la actualización
    const data = { id_estado: id_estado }; // Asigna el nuevo estado al objeto data

    // Construye la URL para la actualización, utilizando las variables
    const url = `solicitud_amistad?id_destinatario=eq.${id_dest}&id_solicitante=eq.${id_sol}`;

    // Llama al método PATCH para actualizar el estado del amigo
    return this.apiService.patch(url, data);
  }
}
