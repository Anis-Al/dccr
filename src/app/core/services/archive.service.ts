import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { 
  ArchiveExcelMetadonneesDto, 
  ArchiveXmlDto, 
  ArchiveCreditsListeDto,
  ArchiveCreditDetailResponse 
} from '../dtos/archive-dtos';

@Injectable({ providedIn: 'root' })
export class ArchiveService {
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly endpoints = environment.endpoints.archives;

  constructor(private http: HttpClient) {}

  getFichiersExcelArchives(): Observable<ArchiveExcelMetadonneesDto[]> {
    return this.http.get<ArchiveExcelMetadonneesDto[]>(
      `${this.apiUrl}${this.endpoints.fichiersExcel}`
    );
  }

  getFichiersXmlArchives(): Observable<ArchiveXmlDto[]> {
    return this.http.get<ArchiveXmlDto[]>(
      `${this.apiUrl}${this.endpoints.fichiersXml}`
    );
  }

  getCreditsArchives(): Observable<ArchiveCreditsListeDto[]> {
    return this.http.get<ArchiveCreditsListeDto[]>(
      `${this.apiUrl}${this.endpoints.credits}`
    );
  }

  getDetailsCreditArchive(
    numContrat: string | null = null, 
    dateDeclaration: Date | null = null
  ): Observable<ArchiveCreditDetailResponse> {
    let params = new HttpParams();
    
    if (numContrat) params = params.append('numContrat', numContrat);
    if (dateDeclaration) {
      params = params.append('dateDeclaration', this.formatDate(dateDeclaration));
    }
    
    return this.http.get<ArchiveCreditDetailResponse>(
      `${this.apiUrl}${this.endpoints.creditDetails}`,
      { params }
    );
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
