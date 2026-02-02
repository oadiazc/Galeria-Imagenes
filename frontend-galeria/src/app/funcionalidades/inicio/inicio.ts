import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Galeria } from '../galeria/galeria';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, Galeria],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  imagenesCarrusel = signal<any[]>([]);

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.cargarImagenes();
  }

  cargarImagenes() {
    this.imageService.obtenerImagenes().subscribe({
      next: (data) => {
        // Mezclar aleatoriamente las imágenes y tomar 5
        const shuffled = data.sort(() => 0.5 - Math.random());
        this.imagenesCarrusel.set(shuffled.slice(0, 5));
      },
      error: (err) => console.error('Error al cargar imágenes para carrusel', err)
    });
  }
}
