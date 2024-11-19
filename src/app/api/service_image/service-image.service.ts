import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createClient } from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class ServiceImageService {

  supabase_cli= createClient(environment.supabase_url, environment.apiKey);

  constructor() { }

  uploadImage(bucket: string, folder: string, id: number, file: File): Observable<any> {
    const bucketName = bucket;
    const fileName = `${folder}-${id}/${file.name}`;

    // Usa el método `from` para acceder al bucket y `upload` para subir el archivo
    return new Observable((observer) => {
      this.supabase_cli.storage
        .from(bucketName)
        .upload(fileName, file)
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data);
            observer.complete();
          }
        })
        .catch((error) => observer.error(error));
    });
  }

  obtenerUrlImagen(bucket: string, path: string): Observable<string | null> {
    const { data} = this.supabase_cli.storage.from(bucket).getPublicUrl(path);
  
    if (data && data.publicUrl) {
      return from([data.publicUrl]); 
    } else {
      console.error('No se pudo obtener la URL de la imagen');
      return from([null]); 
    }
  }
}
