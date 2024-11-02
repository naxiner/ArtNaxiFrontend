import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SDRequest } from '../models/sd-request';
import { SDResponse } from '../models/sd-response';
import { Observable } from 'rxjs';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {
  private apiUrl = `${environment.apiUrl}/image`;

  constructor(private http: HttpClient) { }

  getAllImages(pageNumber: number, pageSize: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getRecentImages(pageNumber: number, pageSize: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/recent?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  getImagesByUserId(userId: string, pageNumber: number, pageSize: number) {
    return this.http.get<{ userImages: Image[], totalPages: number }>(
        `${this.apiUrl}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
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
}
