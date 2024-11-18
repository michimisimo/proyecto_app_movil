import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private readonly accessToken = environment.mapbox_Key;
  private readonly baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor(private http: HttpClient) { }

  searchAddress(term: string): Observable<any> {
    const url = `${this.baseUrl}/${term}.json?types=address&access_token=${this.accessToken}`;
    return this.http.get<any>(url);
  }

  getCoordinates(address: string): Observable<any> {
    const url = `${this.baseUrl}/${address}.json?types=address&access_token=${this.accessToken}`;
    return new Observable<any>((observer) => {
      this.http.get<any>(url).subscribe((res: any) => {
        const feature = res.features[0];
        if (feature) {
          const [lng, lat] = feature.center;
          observer.next({ lng, lat }); // Emite los valores
        } else {
          observer.error('No se encontraron coordenadas para esta dirección');
        }
        observer.complete();
      });
    });
  }

  // Nueva función: Geocodificación inversa para obtener dirección a partir de coordenadas
  getAddressFromCoordinates(lat: number, lng: number): Observable<string> {
    const url = `${this.baseUrl}/${lng},${lat}.json?access_token=${this.accessToken}`;
    return new Observable((observer) => {
      this.http.get<any>(url).subscribe(
        (response) => {
          if (response.features && response.features.length > 0) {
            observer.next(response.features[0].place_name);
          } else {
            observer.error('No se encontró una dirección.');
          }
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }


}