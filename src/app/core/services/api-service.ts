import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { BaseApiService, Request, TResponse } from '../interfaces/base-api-interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements BaseApiService<any> {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrl = environment.dev.apiUrl;

  get<T>(request: Request): Observable<T[]> {
    const url = request.id ? `${this._baseUrl}${request.url}/${request.id}` : `${this._baseUrl}${request.url}`;
    return this._httpClient.get<T[]>(url).pipe(
      catchError(() => of([]))
    );
  }

  post<T>(request: Request): Observable<TResponse<T>> {
    return this._httpClient.post<T>(`${this._baseUrl}${request.url}`, request.body).pipe(
      catchError(() => of(null))
    );
  }

  put<T>(request: Request): Observable<TResponse<T>> {
    if (request.id === undefined) return of(null);
    return this._httpClient.put<T>(`${this._baseUrl}${request.url}/${request.id}`, request.body).pipe(
      catchError(() => of(null))
    );
  }

  delete<T>(request: Request): Observable<TResponse<boolean>> {
    if (request.id === undefined) return of(false);
    return this._httpClient.delete<boolean>(`${this._baseUrl}${request.url}/${request.id}`).pipe(
      catchError(() => of(false))
    );
  }
}

