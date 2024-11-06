import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RegisterDTO } from '../../models/register';
import { LoginDTO } from '../../models/login';
import { AuthResponse } from '../../models/auth-response';
import { RegisterResponse } from '../../models/register-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  registerUser(data: RegisterDTO): Observable<AuthResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data).pipe(
      switchMap(() => {
        return this.loginUser({ usernameOrEmail: data.username, password: data.password });
      })
    );
  }

  loginUser(data: LoginDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data, { withCredentials: true }).pipe(
      switchMap((response: AuthResponse) => {
        this.handleAuthentication(response);
        return of(response);
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  refreshToken(): Observable<string> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      switchMap((response: AuthResponse) => {
        this.setToken(response.token);
        return of(response.token);
      })
    );
  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.unique_name || null;
    }
    return null;
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.nameid || null;
    }
    return null;
  }

  getUserRoleFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.role || null;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();
  }

  handleAuthentication(response: AuthResponse): void {
    this.setToken(response.token);
    const username = this.getUserNameFromToken();
    this.setUsername(username ?? 'unknown');
  }
}
