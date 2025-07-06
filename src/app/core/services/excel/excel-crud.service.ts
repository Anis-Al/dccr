import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExcelMetadonneesDto } from '../../dtos/Excel/excel-metadonnees-dto';
import { ExportDonneesDto } from '../../dtos/Excel/export-donnees-dto';

@Injectable({
  providedIn: 'root'
})
export class ExcelCrudService {
  private readonly baseUrl = environment.apiBaseUrl;
  private excelCache = new BehaviorSubject<ExcelMetadonneesDto[]>([]);
  private tempsDerniereRequete: number = 0;
  private readonly timeout = 60 * 60 * 1000;

  constructor(private http: HttpClient) { }

  getTousLesMetadonneesDuExcel(): Observable<ExcelMetadonneesDto[]> {
    const now = Date.now();
    const cacheAge = now - this.tempsDerniereRequete;

    if (cacheAge < this.timeout && this.excelCache.value.length > 0) {
      return of(this.excelCache.value);
    }

    const url = `${this.baseUrl}${environment.endpoints.excel.tousLesFichiersExcelEnCours}`;
    return this.http.get<ExcelMetadonneesDto[]>(url).pipe(
      tap(metadonnees => {
        this.excelCache.next(metadonnees);
        this.tempsDerniereRequete = now;
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  actualiserMetadonnees(): Observable<ExcelMetadonneesDto[]> {
    const url = `${this.baseUrl}${environment.endpoints.excel.tousLesFichiersExcelEnCours}`;
    return this.http.get<ExcelMetadonneesDto[]>(url).pipe(
      tap(metadonnees => {
        this.excelCache.next(metadonnees);
        this.tempsDerniereRequete = Date.now();
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  getMetadonneesPourGenerationDeclarations(): Observable<ExcelMetadonneesDto[]> {
    const url = `${this.baseUrl}${environment.endpoints.excel.getMetadonneesPourGenerationDeclarations}`;
    return this.http.get<ExcelMetadonneesDto[]>(url).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  getMetadonneesActuelles(): Observable<ExcelMetadonneesDto[]> {
    return this.excelCache.asObservable();
  }

  supprimerFichierExcel(idFichierExcel: number): Observable<void> {
    const url = `${this.baseUrl}${environment.endpoints.excel.supprimerFichierExcel}/${idFichierExcel}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        const fichiers = this.excelCache.value.filter(f => f.id_fichier_excel !== idFichierExcel);
        this.excelCache.next(fichiers);
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  /**
   * Exporte des données vers un fichier Excel
   * @param data Les données à exporter
   * @param nomFeuille Le nom de la feuille Excel (optionnel)
   * @returns Un Observable contenant le fichier Excel sous forme de Blob
   */
  exporterVersExcel<T>(data: T[], nomFeuille: string = 'export'): Observable<Blob> {
    const url = `${this.baseUrl}${environment.endpoints.excel.exporterDonnees}`;
    const exportDto: ExportDonneesDto<T> = {
      donnees: data,
      nomFeuille: nomFeuille
    };

    return this.http.post(url, exportDto, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    }).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message || 'Une erreur est survenue lors de l\'export'));
      })
    );
  }
}
