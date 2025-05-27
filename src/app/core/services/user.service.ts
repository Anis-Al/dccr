import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, user);
  }

  addLdapUser(userData: Pick<User, 'matricule' | 'role'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/ldap`, userData);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.matricule}`, user);
  }
deleteUser(matricule: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${matricule}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl+environment.endpoints.utilisateurs.tousLesUtilisateurs);
  }

  
}