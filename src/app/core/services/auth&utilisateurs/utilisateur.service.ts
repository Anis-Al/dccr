import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../../dtos/Utilisateurs/utilisateur-dto';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  ajouterUtilisateur(utilisateur: Utilisateur): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}${environment.endpoints.utilisateurs.ajouterUtilisateur}`, utilisateur);
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
  getUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl+environment.endpoints.utilisateurs.tousLesUtilisateurs);
  }
}