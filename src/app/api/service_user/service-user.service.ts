import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { GetUser } from 'src/app/models/user/get_user';

@Injectable({
  providedIn: 'root'
})
export class ServiceUserService {

  constructor(private apiService: ServiceApiConfigService) { }

  // Método para hacer login
  login(usuario: string): Observable<HttpResponse<any>> {
    return this.apiService.get(`users?usuario=eq.${usuario}&select=*`);
  }

  //buscar user
  getUsers(): Observable<HttpResponse<GetUser[]>> {
    return this.apiService.get<GetUser[]>('users'); // Llama al método get del servicio de configuración
  }

  getUserById(id: string): Observable<HttpResponse<any>> {
    return this.apiService.get(`users/${id}`); // Llama al método get para un usuario específico
  }

  createUser(data: any): Observable<HttpResponse<any>> {
    return this.apiService.post('users', data); // Llama al método post para crear un nuevo usuario
  }

  updateUser(id: string, data: any): Observable<HttpResponse<any>> {
    return this.apiService.patch(`users/${id}`, data); // Llama al método patch para actualizar un usuario
  }

  deleteUser(id: string): Observable<HttpResponse<any>> {
    return this.apiService.delete(`users/${id}`); // Llama al método delete para eliminar un usuario
  }

}
