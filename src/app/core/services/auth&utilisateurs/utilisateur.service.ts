import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { Utilisateur } from '../../dtos/Utilisateurs/utilisateur-dto';
import { environment } from '../../../../environments/environment';
import { map, catchError, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  ajouterUtilisateur(utilisateur: Utilisateur): Observable<string > {
    return this.http.post<string>(`${this.apiUrl}${environment.endpoints.utilisateurs.ajouterUtilisateur}`, utilisateur,{ responseType: 'text' as 'json' });
  }
  ajouterUtilisateurLdap(userData: Pick<Utilisateur, 'matricule' | 'role'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/ldap`, userData);
  }
  majUtilisateur(user: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${user.matricule}`, user);
  }
  suppUtilisateur(matricule: number): Observable<{ message: string }> {
    return (this.http.delete(
      `${this.apiUrl}${environment.endpoints.utilisateurs.supprimerUtilisateur}/${matricule}`,
      { responseType: 'text' as 'json' }
    ) as Observable<any>).pipe(
      map((text: string) => ({ message: text }))
    );
  }

  private utilisateursCache = new BehaviorSubject<Utilisateur[] | null>(null);
  private enCoursDeChargement = false;

  getUsers(): Observable<Utilisateur[]> {
    const donneesCachees = this.utilisateursCache.value;
    if (donneesCachees) {
      return of(donneesCachees);
    }
    
    if (this.enCoursDeChargement) {
      return this.utilisateursCache.pipe(
        filter((utilisateurs): utilisateurs is Utilisateur[] => utilisateurs !== null),
        catchError(() => of([]))
      );
    }

    this.enCoursDeChargement = true;
    
    return this.http.get<Utilisateur[]>(
      `${this.apiUrl}${environment.endpoints.utilisateurs.tousLesUtilisateurs}`
    ).pipe(
      tap(utilisateurs => {
        this.utilisateursCache.next(utilisateurs);
        this.enCoursDeChargement = false;
      }),
      catchError(erreur => {
        this.enCoursDeChargement = false;
        console.error('Erreur lors de la récupération des utilisateurs:', erreur);
        return throwError(() => new Error('Erreur lors de la récupération des utilisateurs'));
      })
    );
  }

  rafraichirUtilisateurs(): Observable<Utilisateur[]> {
    this.enCoursDeChargement = true;
    
    return this.http.get<Utilisateur[]>(
      `${this.apiUrl}${environment.endpoints.utilisateurs.tousLesUtilisateurs}`
    ).pipe(
      tap(utilisateurs => {
        this.utilisateursCache.next(utilisateurs);
        this.enCoursDeChargement = false;
      }),
      catchError(erreur => {
        this.enCoursDeChargement = false;
        console.error('Erreur lors du rafraîchissement des utilisateurs:', erreur);
        return throwError(() => new Error('Erreur lors du rafraîchissement des utilisateurs'));
      })
    );
  }

  viderCacheUtilisateurs(): void {
    this.utilisateursCache.next(null);
  }

  getUserByMatricule(matricule: string | number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}${environment.endpoints.utilisateurs.unUtilisateur}/${matricule}`);
  }
}