import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Credit } from '../models/credits';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.baseUrl}${environment.endpoints.credits}`);
  }

  validateData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${environment.endpoints.validate}`, data);
  }

  processFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}${environment.endpoints.process}`, formData);
  }
}
