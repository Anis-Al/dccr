import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, tap, filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { kpi } from '../../dtos/tableau-de-bord/kpis-dto';

@Injectable({
  providedIn: 'root'
})
export class KpisService {
  private readonly baseUrl = environment.apiBaseUrl;
  private donneesKpiCachees = new BehaviorSubject<kpi<any>[] | null>(null);
  private enCoursDeChargement = false;
  private erreur: any = "";

  constructor(private http: HttpClient) { }

  obtenirKPIs(): Observable<kpi<any>[]> {
    const donneesCachees = this.donneesKpiCachees.value;
    if (donneesCachees) {
      return of(donneesCachees);
    }
    
    if (this.enCoursDeChargement) {
      return this.donneesKpiCachees.pipe(
        filter((donnees): donnees is kpi<any>[] => donnees !== null),
        catchError(() => of([]))
      );
    }

    this.enCoursDeChargement = true;
    
    return this.http.get<kpi<any>[]>(
      `${this.baseUrl}${environment.endpoints.tableauDeBord.kpis}`
    ).pipe(
      tap(donnees => {
        this.donneesKpiCachees.next(donnees);
        this.enCoursDeChargement = false;
      }),
      catchError(erreur => {
        this.enCoursDeChargement = false;
        console.error('Erreur lors de la récupération des KPIs:', erreur);
        return throwError(() => new Error('Erreur lors de la récupération des KPIs'));
      })
    );
  }


  rafraichirKPIs(): Observable<kpi<any>[]> {
    this.enCoursDeChargement = true;
    
    return this.http.get<kpi<any>[]>(
      `${this.baseUrl}${environment.endpoints.tableauDeBord.kpis}`
    ).pipe(
      tap(donnees => {
        this.donneesKpiCachees.next(donnees);
        console.log('KPIs rafraîchis:', donnees);
        this.enCoursDeChargement = false;
      }),
      catchError(erreur => {
        this.enCoursDeChargement = false;
        console.error('Erreur lors du rafraîchissement des KPIs:', erreur);
        return throwError(() => new Error('Erreur lors du rafraîchissement des KPIs'));
      })
    );
  }


  viderCacheKPIs(): void {
    this.donneesKpiCachees.next(null);
  }
}
