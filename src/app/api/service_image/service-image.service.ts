import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceImageService {

  constructor() { }

  uploadImage(bucket: string, folder: string, idPersona: number, file: File): Observable<any> {
    const bucketName = bucket;
    const fileName = `${folder}-${idPersona}/${file.name}`;

    // Usa el método `from` para acceder al bucket y `upload` para subir el archivo
    return new Observable((observer) => {
      environment.supabase.storage
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
    const { data} = environment.supabase.storage.from(bucket).getPublicUrl(path);
  
    if (data && data.publicUrl) {
      return from([data.publicUrl]); 
    } else {
      console.error('No se pudo obtener la URL de la imagen');
      return from([null]); 
    }
  }
}
