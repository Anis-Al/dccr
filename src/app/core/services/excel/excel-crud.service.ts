import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExcelMetadonneesDto } from '../../dtos/Excel/excel-metadonnees-dto';

@Injectable({
  providedIn: 'root'
})
export class ExcelCrudService {
 private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getTousLesMetadonneesDuExcel(): Observable<ExcelMetadonneesDto[]> {
    const url = `${this.baseUrl}${environment.endpoints.excel.tousLesFichiersExcelEnCours}`; 
    return this.http.get<ExcelMetadonneesDto[]>(url)
      .pipe(
        tap(resultat=>{console.log(resultat)}),
        catchError((error: HttpErrorResponse): Observable<never> => {
          return throwError(() => new Error(error.message));
        })
      );
      
      
        
      
  }
  
}
