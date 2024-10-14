import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';

@Injectable({
  providedIn: 'root'
})
export class ServiceUsuarioService {

  constructor(private apiService: ServiceApiConfigService) { }

  // Método para obtener un usuario por su ID
  getUsuarioById(id: number): Observable<HttpResponse<PerfilUsuario>> {
    return this.apiService.get<PerfilUsuario>(`usuario?id_persona=eq.${id}&select=*`); // Llama al método get para un usuario específico
  }

  getUsuarioByIdUser(id: number): Observable<HttpResponse<PerfilUsuario[]>> {
    return this.apiService.get<PerfilUsuario[]>(`usuario?id_user=eq.${id}&select=*`); // Llama al método get para un usuario específico
  }

  //buscar user
  getUsuario(): Observable<HttpResponse<any>> {
    return this.apiService.get('usuario'); // Llama al método get del servicio de configuración
  }

  createUsuario(data: any): Observable<HttpResponse<PerfilUsuario>> {
    return this.apiService.post<PerfilUsuario>('usuario', data); // Llama al método post para crear un nuevo usuario
  }

  updateUsuario(id: string, data: any): Observable<HttpResponse<any>> {
    return this.apiService.patch(`usuario/${id}`, data); // Llama al método patch para actualizar un usuario
  }

  deleteUsuario(id: string): Observable<HttpResponse<any>> {
    return this.apiService.delete(`usuario/${id}`); // Llama al método delete para eliminar un usuario
  }
}
