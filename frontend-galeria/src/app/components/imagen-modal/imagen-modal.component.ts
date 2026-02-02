import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-imagen-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imagen-modal.component.html',
  styleUrl: './imagen-modal.component.css'
})
export class ImagenModal {
  @Input() imagen: any = {};
  @Input() mostrar = signal(false);
  @Output() cerrar$ = new EventEmitter<void>();

  agregado = signal(false);
  errorStock = signal(false);

  stockDisponible = computed(() => {
    const itemEnCarrito = this.cartService.items().find(i => i._id === this.imagen._id);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    return Math.max(0, this.imagen.stock - cantidadEnCarrito);
  });

  constructor(private cartService: CartService) { }

  cerrar() {
    this.mostrar.set(false);
    this.cerrar$.emit();
  }

  agregarCarrito() {
    const exito = this.cartService.agregarAlCarrito(this.imagen);

    if (exito) {
      this.agregado.set(true);
      this.errorStock.set(false);
      setTimeout(() => this.agregado.set(false), 2000);
    } else {
      this.errorStock.set(true);
      setTimeout(() => this.errorStock.set(false), 3000);
    }
  }
}
