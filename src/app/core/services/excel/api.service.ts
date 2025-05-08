import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ReponseIntegrationDto } from '../../dtos/Excel/integration-response.dto';
import { DemandeIntegrationDto } from '../../dtos/Excel/demande-integration.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  processFile(demande: DemandeIntegrationDto): Observable<ReponseIntegrationDto> {
    const formData = new FormData();
    formData.append('fichier', demande.file); 
    formData.append('matricule_utilisateur', demande.userId); 
    return this.http.post<ReponseIntegrationDto>(`${this.baseUrl}${environment.endpoints.excel.integrationPart1}`, formData);
  }

  telechargerFichierErreursExcel(idExcel: number): Observable<HttpResponse<Blob>> {
    const url = `${this.baseUrl}${environment.endpoints.excel.exportationErreurs}/${idExcel}`;
  
    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  confirmerIntegration(id_excel: number): Observable<any> {
    const url = `${this.baseUrl}${environment.endpoints.excel.integrationPart2}`;
    const params = new HttpParams().set('idExcel', id_excel.toString());
    return this.http.post<any>(url, {}, { params });
  }

}
