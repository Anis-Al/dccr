import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExcelMetadonneesDto } from '../../dtos/Excel/excel-metadonnees-dto';

@Injectable({
  providedIn: 'root'
})
export class ExcelCrudService {
  private readonly baseUrl = environment.apiBaseUrl;
  private excelCache = new BehaviorSubject<ExcelMetadonneesDto[]>([]);
  private tempsDerniereRequete: number = 0;
  private readonly cacheTimeout = 5 * 60 * 1000;

  constructor(private http: HttpClient) { }

  getTousLesMetadonneesDuExcel(): Observable<ExcelMetadonneesDto[]> {
    const now = Date.now();
    const cacheAge = now - this.tempsDerniereRequete;

    if (cacheAge < this.cacheTimeout && this.excelCache.value.length > 0) {
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

  
}
