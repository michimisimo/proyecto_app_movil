import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceApiConfigService } from '../service-api-config/service-api-config.service';
import { Tag } from 'src/app/models/tag';

@Injectable({
  providedIn: 'root'
})
export class ServiceTagService {

  private baseUrl: string = 'https://zkfhrkmxpowygtruytmr.supabase.co/rest/v1/tag';

  constructor(private apiService: ServiceApiConfigService) { }

  // Obtener todos los tags
  getTags(): Observable<HttpResponse<any>> {
    return this.apiService.get('tag');
  }

  // Crear un nuevo tag
  createTag(data: any): Observable<HttpResponse<any>> {
    return this.apiService.post('tag', data);
  }

  // Eliminar un tag por ID
  deleteTag(id: number): Observable<HttpResponse<any>> {
    return this.apiService.delete(`tag/${id}`);
  }

  // Buscar tag por ID
  getTagById(id: number): Observable<HttpResponse<Tag>> {
    return this.apiService.get<Tag>(`tag?id_tag=eq.${id}&select=*`); // Llama al método get para un evento específico
  }

}
