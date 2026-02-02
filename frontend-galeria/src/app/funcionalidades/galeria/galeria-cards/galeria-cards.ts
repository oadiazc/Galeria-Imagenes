import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenModal } from '../../../components/imagen-modal/imagen-modal.component';
import { FavoritesService } from '../../../services/favorites.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-galeria-cards',
  standalone: true,
  imports: [CommonModule, ImagenModal],
  templateUrl: './galeria-cards.html',
  styleUrl: './galeria-cards.css',
})
export class GaleriaCards {
  @Input() imagen: any = {};
  mostrarModal = signal(false);

  constructor(
    public favoritesService: FavoritesService,
    public authService: AuthService,
    private router: Router
  ) { }

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  toggleFavorito(event: Event) {
    event.stopPropagation(); // Evitar abrir el modal

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.favoritesService.toggleFavorito(this.imagen._id).subscribe();
  }
}
