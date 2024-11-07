import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/userprofile`;

  constructor(private http: HttpClient) { }

  getUserProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getUserProfileAvatar(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/avatar/${id}`);
  }

  updateProfileAvatar(id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.apiUrl}/avatar/${id}`, formData, { headers });
  }
}
