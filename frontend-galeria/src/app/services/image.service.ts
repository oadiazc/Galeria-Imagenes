import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Image } from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) { }

  obtenerImagenes(): Observable<Image[]> {
    return this.http.get<Image[]>(this.apiUrl);
  }

  obtenerImagenPorId(id: string): Observable<Image> {
    return this.http.get<Image>(`${this.apiUrl}/${id}`);
  }

  subirImagen(formData: FormData): Observable<Image> {
    return this.http.post<Image>(this.apiUrl, formData);
  }

  actualizarImagen(id: string, formData: FormData): Observable<Image> {
    return this.http.put<Image>(`${this.apiUrl}/${id}`, formData);
  }

  eliminarImagen(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}
