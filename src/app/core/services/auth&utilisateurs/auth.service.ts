import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { loginDto } from '../../dtos/Auth/login-dto';
import { LoginReponseDto } from '../../dtos/Auth/login-dto';
import { changerMotDePasseDto } from '../../dtos/Auth/login-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;
  private readonly clejwt = 'auth_token';
  private readonly userInfoKey = 'user_info';

  constructor(private http: HttpClient) {}

  login(loginData: loginDto): Observable<LoginReponseDto> {
    return this.http.post<LoginReponseDto>(`${this.apiUrl}${environment.endpoints.auth.login}`, loginData);
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
    return !!this.getToken();
  }

  getUserInfo(): { name: string; role: string } | null {
    const userInfo = localStorage.getItem(this.userInfoKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  setUserInfo(userInfo: { name: string; role: string }): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
  }

  removeUserInfo(): void {
    localStorage.removeItem(this.userInfoKey);
  }

  logout(): void {
    this.removeToken();
    this.removeUserInfo();
  }

  changerMotDePasse(dto: changerMotDePasseDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}${environment.endpoints.auth.changerMotDePasse}`, dto);
  }
}