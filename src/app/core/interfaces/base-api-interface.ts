import { Observable } from 'rxjs';

export type TResponse<T> = T | null | boolean;
export interface Request {
  url: string;
  body?: any;
  id?: number;
}
export interface BaseApiService<T> {

  get<T>(request: Request): Observable<TResponse<T[]>>;

  post<T>(request: Request): Observable<TResponse<T>>;

  put<T>(request: Request): Observable<TResponse<T>>;

  delete<T>(request: Request): Observable<TResponse<boolean>>;
}
