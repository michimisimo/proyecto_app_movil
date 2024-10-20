import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvitacionEvento } from 'src/app/models/invitacion_evento';


@Injectable({
  providedIn: 'root'
})
export class ServiceInvitacionEventoService {

  constructor(private apiService: ServiceApiConfigService) { }

  getInvitacion(): Observable<HttpResponse<any>> {
    return this.apiService.get('invitacion_evento');
  }

  getInvitacionById(id: number): Observable<HttpResponse<InvitacionEvento[]>> {
    return this.apiService.get<InvitacionEvento[]>(`invitacion_evento?id=eq.${id}&select=*`);
  }

  createInvitacion(data: any): Observable<HttpResponse<any>> {
    return this.apiService.post('invitacion_evento', data);
  }

  updateInvitacion(id: number, data: any): Observable<HttpResponse<any>> {
    return this.apiService.patch(`invitacion_evento/${id}`, data);
  }

  deleteInvitacion(id: string): Observable<HttpResponse<any>> {
    return this.apiService.delete(`invitacion_evento/${id}`);
  }

  getInvitacionByInvitadoId(id: number): Observable<HttpResponse<InvitacionEvento[]>> {
    return this.apiService.get<InvitacionEvento[]>(`invitacion_evento?id_invitado=eq.${id}&select=*`);
  }

  updateEstado(id_invitacion: number, id_estado: number): Observable<HttpResponse<any>> {
    // Prepara los datos para la actualización
    const data = { id_estado }; // Asigna el nuevo estado al objeto data

    // Construye la URL para la actualización, utilizando las variables
    const url = `invitacion_evento?&id_invitacion=eq.${id_invitacion}`;

    // Llama al método PATCH para actualizar el estado del amigo
    return this.apiService.patch(url, data);
  }


}
