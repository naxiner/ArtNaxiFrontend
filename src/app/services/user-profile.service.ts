import { HttpClient } from '@angular/common/http';
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
}
