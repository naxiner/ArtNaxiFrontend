import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddStyleRequest } from '../../models/add-style-request';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  private apiUrl = `${environment.apiUrl}/style`;

  constructor(private http: HttpClient) { }

  getStyleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getStyleByName(styleName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/name/${styleName}`);
  }

  getAllStyles(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getTotalStylesCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/total-count`)
  }

  addStyle(style: AddStyleRequest): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}`, style, { headers });
  }

  deleteStyleById(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
