import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../../dtos/Utilisateurs/utilisateur-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  addUser(user: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}`, user);
  }

  addLdapUser(userData: Pick<Utilisateur, 'matricule' | 'role'>): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/ldap`, userData);
  }

  updateUser(user: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${user.matricule}`, user);
  }
deleteUser(matricule: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${matricule}`);
  }

  getUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl+environment.endpoints.utilisateurs.tousLesUtilisateurs);
  }

  
}