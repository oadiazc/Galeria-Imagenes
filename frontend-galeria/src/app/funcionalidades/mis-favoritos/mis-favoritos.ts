import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleriaCards } from '../galeria/galeria-cards/galeria-cards';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-mis-favoritos',
    standalone: true,
    imports: [CommonModule, GaleriaCards, RouterModule],
    templateUrl: './mis-favoritos.html',
    styleUrl: './mis-favoritos.css'
})
export class MisFavoritos implements OnInit {
    imagenes = signal<any[]>([]);
    loading = signal(true);

    constructor(private http: HttpClient, private authService: AuthService) { }

    ngOnInit() {
        this.cargarFavoritos();
    }

    cargarFavoritos() {
        this.loading.set(true);
        // Usamos el endpoint que devuelve los objetos populados
        this.http.get<any[]>(`${environment.apiUrl}/usuarios/favoritos`).subscribe({
            next: (data) => {
                this.imagenes.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error al cargar favoritos', err);
                this.loading.set(false);
            }
        });
    }
}
