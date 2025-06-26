import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { XmlDto } from '../../dtos/DeclarationsBA/declarationsBA-dto';

@Injectable({
  providedIn: 'root'
})
export class DeclarationsBAService {
private apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

  genererDeclarations(idExcel: number, matricule_utilisateur: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}${environment.endpoints.declarationsBA.genererDeclarationsParExcel}/${idExcel}&${matricule_utilisateur}`,
      {}
    );
  }
  
  telechargerDeclarations(idXml: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${environment.endpoints.declarationsBA.telechargerDeclarations}/${idXml}`, {
      responseType: 'blob'
    });
  }

  getTousLesDeclarations(): Observable<XmlDto[]> {
    return this.http.get<XmlDto[]>(`${this.apiUrl}${environment.endpoints.declarationsBA.tousLesDeclarations}`);
  }
  supprimerDeclaration(idXml: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${environment.endpoints.declarationsBA.supprimerDeclaration}/${idXml}`);
  }

  archiverDeclaration(idExcel: number): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}${environment.endpoints.declarationsBA.archiverDeclaration}/${idExcel}`, 
      {}
    );
  }


}
