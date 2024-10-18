import { Injectable } from '@angular/core';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicePerfilUsuarioService {

  // Clase de RxJS (Reactive Extensions for JavaScript) que siempre tiene un valor actual
  // Se establece y se limpia el valor a través de las funciones setUser() y clearUser()
  private usuarioSubject = new BehaviorSubject<PerfilUsuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private apiService: ServiceApiConfigService) { }

  setPerfilUsuario(usuario: PerfilUsuario) {
    this.usuarioSubject.next(usuario);
  }

  clearPerfilUsuario() {
    this.usuarioSubject.next(null);
  }

  // Método para obtener un usuario por su ID
  getPerfilUsuarioById(id: number): Observable<HttpResponse<PerfilUsuario[]>> {
    return this.apiService.get<PerfilUsuario[]>(`perfil_usuario?id_persona=eq.${id}&select=*`); // Llama al método get para un usuario específico
  }

  getPerfilUsuarioByIdUser(id: number): Observable<HttpResponse<PerfilUsuario[]>> {
    return this.apiService.get<PerfilUsuario[]>(`perfil_usuario?id_user=eq.${id}&select=*`); // Llama al método get para un usuario específico
  }

  //buscar user
  getPerfilUsuario(): Observable<HttpResponse<PerfilUsuario[]>> {
    return this.apiService.get<PerfilUsuario[]>('perfil_usuario'); // Llama al método get del servicio de configuración
  }

  createPerfilUsuario(data: any): Observable<HttpResponse<PerfilUsuario>> {
    return this.apiService.post<PerfilUsuario>('perfil_usuario', data); // Llama al método post para crear un nuevo usuario
  }

  updatePerfilUsuario(id: string, data: any): Observable<HttpResponse<any>> {
    return this.apiService.patch(`perfil_usuario/${id}`, data); // Llama al método patch para actualizar un usuario
  }

  deletePerfilUsuario(id: string): Observable<HttpResponse<any>> {
    return this.apiService.delete(`perfil_usuario/${id}`); // Llama al método delete para eliminar un usuario
  }

  
}
