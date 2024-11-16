import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from '../../models/image';
import { SDRequest } from '../../models/sd-request';
import { SDResponse } from '../../models/sd-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {
  private apiUrl = `${environment.apiUrl}/image`;

  constructor(private http: HttpClient) { }

  getAllImages(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getRecentImages(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recent?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  getRecentPublicImages(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recent/public?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  getImageById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getImagesByUserId(userId: string, pageNumber: number, pageSize: number) {
    return this.http.get<{ userImages: Image[], totalPages: number }>(
        `${this.apiUrl}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getPublicImagesByUserId(userId: string, pageNumber: number, pageSize: number) {
    return this.http.get<{ userImages: Image[], totalPages: number }>(
        `${this.apiUrl}/user/${userId}/public?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  generateImage(request: SDRequest): Observable<SDResponse> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post<SDResponse>(this.apiUrl, request, { headers });
  }

  deleteImage(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  makeImagePublic(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/${id}/make-public`, { headers });
  }

  makeImagePrivate(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/${id}/make-private`, { headers });
  }
}
