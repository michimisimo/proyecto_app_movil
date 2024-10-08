import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTagService {

  private baseUrl: string = 'https://zkfhrkmxpowygtruytmr.supabase.co/rest/v1/tag';

  constructor(private http: HttpClient) { }

  // Obtener todos los tags
  getTags(): Observable<any> {
    return this.http.get(`${this.baseUrl}?select=*`);
  }

  // Crear un nuevo tag
  createTag(tagData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, tagData);
  }

  // Eliminar un tag por ID
  deleteTag(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?ID_tag=eq.${id}`);
  }

}
