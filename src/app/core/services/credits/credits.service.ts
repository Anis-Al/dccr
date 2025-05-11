import { Injectable } from '@angular/core';
import { CreditDto } from '../../dtos/Credits/credits';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditsService {
  private readonly baseUrl = environment.apiBaseUrl;
  private creditsCache = new BehaviorSubject<CreditDto[]>([]);
  private tempsDerniereRequete: number = 0;
  private readonly cacheTimeout = 5 * 60 * 1000; 

  constructor(private http:HttpClient) { }

  getTousLesCredits(): Observable<CreditDto[]> {
    const now = Date.now();
    const cacheAge = now - this.tempsDerniereRequete;

    if (cacheAge < this.cacheTimeout && this.creditsCache.value.length > 0) {
      return of(this.creditsCache.value);
    }

    const url = `${this.baseUrl}${environment.endpoints.credits.tousLesCreditsEnCours}`;
    return this.http.get<CreditDto[]>(url).pipe(
      tap(credits => {
        this.creditsCache.next(credits);
        this.tempsDerniereRequete = now;
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  actualiserCredits(): Observable<CreditDto[]> {
    const url = `${this.baseUrl}${environment.endpoints.credits.tousLesCreditsEnCours}`;
    return this.http.get<CreditDto[]>(url).pipe(
      tap(credits => {
        this.creditsCache.next(credits);
        this.tempsDerniereRequete = Date.now();
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  getCreditsActuelles(): Observable<CreditDto[]> {
    return this.creditsCache.asObservable();
  }
  
}
