import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SDRequest } from '../models/sd-request';
import { SDResponse } from '../models/sd-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {
  private apiUrl = `${environment.apiUrl}/image`;

  constructor(private http: HttpClient) { }

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
