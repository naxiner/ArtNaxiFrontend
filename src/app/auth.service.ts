import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user';
import { RegisterDTO } from '../models/register';
import { LoginDTO } from '../models/login';
import { Token } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  registerUser(data: RegisterDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data).pipe(
      switchMap(() => this.loginUser({usernameOrEmail: data.username, password: data.password }))
    );
  }

  loginUser(data: LoginDTO): Observable<any> {
    return this.http.post<Token>(`${this.apiUrl}/login`, data);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
