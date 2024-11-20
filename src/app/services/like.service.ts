import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = `${environment.apiUrl}/like`;

  constructor(private http: HttpClient) { }

  getLikeCount(entityId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${entityId}/count`);
  }

  getLikeStatus(userId: string, entityId: string, entityType: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrl}/like-status?userId=${userId}&entityId=${entityId}&entityType=${entityType}`, { headers });
  }

  likeEntity(entityId: string, entityType: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/like?entityId=${entityId}&entityType=${entityType}`, { headers });
  }

  dislikeEntity(entityId: string, entityType: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/dislike?entityId=${entityId}&entityType=${entityType}`, { headers });
  }
}
