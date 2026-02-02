// Módulo de Funcionalidades
//Galería 
//tiene ruta propia
import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleriaCards } from './galeria-cards/galeria-cards';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, GaleriaCards],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class Galeria implements OnInit {
  todasImagenes = signal<any[]>([]);
  categoriaSeleccionada = signal<string>('');
  cargando = signal(true);
  
  // Computed signal que filtra las imágenes según la categoría seleccionada
  imagenes = computed(() => {
    const todas = this.todasImagenes();
    const categoria = this.categoriaSeleccionada();
    
    if (!categoria || categoria === '') {
      return todas; // Mostrar todas las imágenes
    }
    return todas.filter(img => img.categoria === categoria);
  });
  
  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.cargarImagenes();
  }
  
  cargarImagenes(): void {
    this.cargando.set(true);
    this.imageService.obtenerImagenes().subscribe({
      next: (data) => {
        this.todasImagenes.set(data);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar imágenes:', error);
        this.cargando.set(false);
      }
    });
  }

  filtrar(categoria: string) {
    this.categoriaSeleccionada.set(categoria);
  }
}
