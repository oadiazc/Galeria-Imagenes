import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private apiUrl = `${environment.apiUrl}/usuarios/favoritos`;

    // Señal para almacenar los IDs de las imágenes favoritas
    favoritos = signal<string[]>([]);

    constructor(private http: HttpClient, private authService: AuthService) {
        // Cargar favoritos si el usuario está logueado
        if (this.authService.isAuthenticated()) {
            this.cargarFavoritos();
        }
    }

    cargarFavoritos() {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (data) => {
                // Asumiendo que el backend devuelve objetos populados o IDs, extraemos IDs
                // Si el backend devuelve objetos Image completos (como está en userRoute populate), mapemos a IDs
                const ids = data.map(item => typeof item === 'object' ? item._id : item);
                this.favoritos.set(ids);
            },
            error: (err) => console.error('Error al cargar favoritos', err)
        });
    }

    toggleFavorito(imagenId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${imagenId}`, {}).pipe(
            tap((res: any) => {
                const currentFavs = this.favoritos();
                if (res.esFavorito) {
                    this.favoritos.set([...currentFavs, imagenId]);
                } else {
                    this.favoritos.set(currentFavs.filter(id => id !== imagenId));
                }
            })
        );
    }

    esFavorito(imagenId: string): boolean {
        return this.favoritos().includes(imagenId);
    }
}
