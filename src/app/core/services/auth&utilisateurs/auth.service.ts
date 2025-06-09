import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { loginDto } from '../../dtos/Auth/login-dto';
import { LoginReponseDto } from '../../dtos/Auth/login-dto';
import { changerMotDePasseDto } from '../../dtos/Auth/login-dto';
import { InfosUtilisateur } from '../../models/infos-utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;
  private readonly clejwt = 'auth_token';

  constructor(private http: HttpClient) {}

  login(loginData: loginDto): Observable<LoginReponseDto> {
    return this.http.post<LoginReponseDto>(`${this.apiUrl}${environment.endpoints.auth.login}`, loginData);
  }

  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
  getToken(): string | null {
    return localStorage.getItem(this.clejwt);
  }
  setToken(token: string): void {
    localStorage.setItem(this.clejwt, token);
  }
  removeToken(): void {
    localStorage.removeItem(this.clejwt);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return decoded.exp * 1000 > Date.now();
  }

  getUserInfo(): InfosUtilisateur | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.decodeToken(token);
    if (!decodedToken) return null;

    return {
      matricule: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
      nom_complet: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
    };
  }

  logout(): void {
    this.removeToken();
  }

  changerMotDePasse(dto: changerMotDePasseDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}${environment.endpoints.auth.changerMotDePasse}`, dto);
  }
}