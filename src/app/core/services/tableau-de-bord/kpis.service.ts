import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { kpi } from '../../dtos/tableau-de-bord/kpis-dto';
import { catchError, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class KpisService {
  
  private readonly baseUrl = environment.apiBaseUrl;
  erreur:any="";

  constructor(private http: HttpClient) { }

  kpis() :Observable<kpi<any>[]> {
    return this.http.get<kpi<any>[]>(`${this.baseUrl}${environment.endpoints.tableauDeBord.kpis}`).pipe(
      catchError(this.erreur)
    );
  }
}
