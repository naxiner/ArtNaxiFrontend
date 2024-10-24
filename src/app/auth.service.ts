import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user';
import { RegisterDTO } from '../models/register';
import { LoginDTO } from '../models/login';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '../models/auth-response';

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

  registerUser(data: RegisterDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data).pipe(
      switchMap((user: User) => this.loginUser({ usernameOrEmail: data.username, password: data.password }).pipe(
        switchMap((response: any) => {
          this.handleAuthentication(response);
          return of(user);
        })
      ))
    );
  }

  loginUser(data: LoginDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
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

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
  }

  handleAuthentication(response: AuthResponse): void {
    this.setToken(response.token);
    const username = this.getUserNameFromToken();
    this.setUsername(username ?? 'unknown');
  }
}
