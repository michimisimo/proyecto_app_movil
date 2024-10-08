import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceApiConfigService {

  private urlBase = environment.api_url;

  constructor(private httpClient : HttpClient) { }

  private getHeaders(): HttpHeaders{
    return new HttpHeaders({
      "apiKey": environment.apiKey,
      "Authorization":"Bearer"+environment.apiKey
    })
  }
  
  private handlerError(error: HttpErrorResponse){
    console.error('Error', error);
    return throwError(()=>error);
  }

  get<T>(path:string, params?:HttpParams):Observable<HttpResponse<T>>{
    return this.httpClient.get<T>((this.urlBase+path),
    {
      headers: this.getHeaders(),
      observe:'response', 
      params: params,
    })
    .pipe(
      catchError(this.handlerError)
    )
  }
  
  post<T>(path:string,data:any): Observable<HttpResponse<T>>{
    return this.httpClient.post<T>(this.urlBase+path,data,{
    headers:this.getHeaders(),
    observe: 'response'
  })
  .pipe(
    catchError(this.handlerError)
  )
  }

  patch<T>(path:string, data:any, params?:HttpParams):Observable<HttpResponse<T>>{
    return this.httpClient.patch<T>((this.urlBase+path),data,
    {
      headers: this.getHeaders(),
      observe:'response', 
      params: params,
    })
    .pipe(
      catchError(this.handlerError)
    )
  }
  
  delete<T>(path:string, params?:HttpParams):Observable<HttpResponse<T>>{
    return this.httpClient.delete<T>((this.urlBase+path),
    {
      headers: this.getHeaders(),
      observe:'response', 
      params: params,
    })
    .pipe(
      catchError(this.handlerError)
    )
  }

}

