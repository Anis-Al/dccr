import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { 
  ArchiveExcelMetadonneesDto, 
  ArchiveXmlDto, 
  ArchiveCreditsListeDto 
} from '../dtos/archive-dtos';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les fichiers Excel archivés
   * @returns Observable contenant la liste des fichiers Excel archivés
   */
  getFichiersExcelArchives(): Observable<ArchiveExcelMetadonneesDto[]> {
    return this.http.get<ArchiveExcelMetadonneesDto[]>(`${this.apiUrl}${environment.endpoints.archives.fichiersExcel}`);
  }

  /**
   * Récupère tous les fichiers XML archivés
   * @returns Observable contenant la liste des fichiers XML archivés
   */
  getFichiersXmlArchives(): Observable<ArchiveXmlDto[]> {
    return this.http.get<ArchiveXmlDto[]>(`${this.apiUrl}${environment.endpoints.archives.fichiersXml}`);
  }

  /**
   * Récupère tous les crédits archivés
   * @returns Observable contenant la liste des crédits archivés
   */
  getCreditsArchives(): Observable<ArchiveCreditsListeDto[]> {
    return this.http.get<ArchiveCreditsListeDto[]>(`${this.apiUrl}${environment.endpoints.archives.credits}`);
  }
}
