import { Injectable } from '@angular/core';
import { CreditDto } from '../../dtos/Credits/credits';
import { TablesDomainesDto, ValeursTableDomaines } from '../../dtos/Credits/tables_domaines';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditsService {
  private readonly baseUrl = environment.apiBaseUrl;
  private creditsCache = new BehaviorSubject<CreditDto[]>([]);
  private domainesCache = new BehaviorSubject<TablesDomainesDto[] | null>(null);
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

  getCreditsActuelles(): Observable<CreditDto[]> {
    return this.creditsCache.asObservable();
  }

  
}
