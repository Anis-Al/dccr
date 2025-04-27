import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Credit } from '../models/credits';
import { ReponseIntegrationDto } from '../dtos/integration-response.dto';
import { DemandeIntegrationDto } from '../dtos/demande-integration.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // getCredits(): Observable<Credit[]> {
  //   return this.http.get<Credit[]>(`${this.baseUrl}${environment.endpoints.credits}`);
  // }

  // validateData(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}${environment.endpoints.validate}`, data);
  // }

  processFile(demande: DemandeIntegrationDto): Observable<ReponseIntegrationDto> {
    const formData = new FormData();
    formData.append('fichier', demande.file); // Backend expects 'fichier'
    formData.append('matricule_utilisateur', demande.userId); // Backend expects 'matricule_utilisateur'
    // Debug: log form data
   
    return this.http.post<ReponseIntegrationDto>(`${this.baseUrl}${environment.endpoints.integration}`, formData);
  }
}
