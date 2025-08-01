import { Injectable } from '@angular/core';
import { CreditDto, CreditsListeDto } from '../../dtos/Credits/credits';
import { TablesDomainesDto, ValeursTableDomaines } from '../../dtos/Credits/tables_domaines';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CreditsService {
  private readonly baseUrl = environment.apiBaseUrl;
  private creditsCache = new BehaviorSubject<CreditsListeDto[]>([]);
  private domainesCache = new BehaviorSubject<TablesDomainesDto[] | null>(null);
  private tempsDerniereRequete: number = 0;
  private readonly timeout = 60 * 60 * 1000; 

  constructor(private http:HttpClient) { }

  getTousLesCredits(): Observable<CreditsListeDto[]> {
    const now = Date.now();
    const cacheAge = now - this.tempsDerniereRequete;

    if (cacheAge < this.timeout && this.creditsCache.value.length > 0) {
      return of(this.creditsCache.value);
    }
    const url = `${this.baseUrl}${environment.endpoints.credits.tousLesCreditsEnCours}`;
    return this.http.get<CreditsListeDto[]>(url).pipe(
      tap(credits => {
        this.creditsCache.next(credits);
        this.tempsDerniereRequete = now;
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }
  actualiserCredits(): Observable<CreditsListeDto[]> {
    const url = `${this.baseUrl}${environment.endpoints.credits.tousLesCreditsEnCours}`;
    return this.http.get<CreditsListeDto[]>(url).pipe(
      tap(credits => {
        this.creditsCache.next(credits);
        this.tempsDerniereRequete = Date.now();
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  getCreditDetails(numContratCredit: string, dateDeclaration: Date): Observable<CreditDto[]> {
    const formattedDate = formatDate(dateDeclaration, 'yyyy-MM-dd', 'en-US');
    const url = `${this.baseUrl}${environment.endpoints.credits.creditDetails}?numContratCredit=${encodeURIComponent(numContratCredit)}&dateDeclaration=${formattedDate}`;
    
    return this.http.get<CreditDto[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching credit details:', error);
        return throwError(() => new Error('Une erreur est survenue lors de la récupération des détails du crédit.'));
      })
    );
  }

 
  getCreditsActuelles(): Observable<CreditsListeDto[]> {
    return this.creditsCache.asObservable();
  }
  ajouterCredit(credit: CreditDto): Observable<any> {
    const url = `${this.baseUrl}${environment.endpoints.credits.ajouterCredit}`;
    return this.http.post<any>(url, credit).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  modifierCredit(credit: CreditDto): Observable<any> {
    const url = `${this.baseUrl}${environment.endpoints.credits.modifierCredit}`;
    return this.http.put<any>(url, credit).pipe(
      tap(() => {
        // Invalidate the cache to force a refresh on next get
        this.tempsDerniereRequete = 0;
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  getTablesDomaines(reactualiser = false): Observable<TablesDomainesDto[]> 
  {
    if (this.domainesCache.value && !reactualiser) {
      return of(this.domainesCache.value);
    }

    const url = `${this.baseUrl}${environment.endpoints.credits.tableDomaines}`;
    return this.http.get<TablesDomainesDto[]>(url).pipe(
      tap(tables => {
        this.domainesCache.next(tables);
      }),
      catchError((error: HttpErrorResponse): Observable<never> => {
        return throwError(() => new Error('Erreur lors de la récupération des tables de domaines.'));
      })
    );
  }
  getDomaineByNomTable(nomTable: string): Observable<ValeursTableDomaines[]> 
  {
    if (this.domainesCache.value) {
      const table = this.domainesCache.value.find(t => t.nom_table === nomTable);
      if (table) {
        return of(table.valeurs);
      }
    }
    return this.getTablesDomaines().pipe(
      map((tables: TablesDomainesDto[]) => {
        const table = tables.find((t: TablesDomainesDto) => t.nom_table === nomTable);
        if (!table) {
          throw new Error(`Aucune table de domaines trouvée avec le nom: ${nomTable}`);
        }
        return table.valeurs;
      }),
      catchError((error: Error) => {
        return throwError(() => new Error(`Erreur lors de la récupération du domaine ${nomTable}: ${error.message}`));
      })
    );
  }

  supprimerCredit(numeroContratCredit: string, dateDeclaration: Date): Observable<string[]> {
    const url = `${this.baseUrl}${environment.endpoints.credits.supprimerCredit}/${encodeURIComponent(numeroContratCredit)}`;
    const params = { dateDeclaration: formatDate(dateDeclaration, 'yyyy-MM-dd', 'en-US') };
    
    return this.http.delete<string[]>(url, { params }).pipe(
      tap(() => {
        this.actualiserCredits().subscribe();
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return of(error.error);
        }
        return throwError(() => new Error('Une erreur est survenue lors de la suppression du crédit.'));
      })
    );
  }
}
