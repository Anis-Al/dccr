import { Injectable } from '@angular/core';
import { CreditDto } from '../../dtos/Credits/credits';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditsService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }

  getTousLesCredits(): Observable<CreditDto[]> {
    const url = `${this.baseUrl}${environment.endpoints.credits.tousLesCreditsEnCours}`; 
    return this.http.get<CreditDto[]>(url)
      .pipe(
        tap(resultat=>{console.log(resultat)}),
        catchError((error: HttpErrorResponse): Observable<never> => {
          return throwError(() => new Error(error.message));
        })
      ); 
  }
  
}
