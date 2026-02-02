import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito-compra.html',
  styleUrl: './carrito-compra.css',
})

export class CarritoCompra {
  mostrarCarrito = signal(false);
  procesandoPago = signal(false);
  mensajeError = signal<string | null>(null);

  constructor(
    public cartService: CartService,
    private paymentService: PaymentService,
    private router: Router
  ) { }

  toggleCarrito() {
    this.mostrarCarrito.update(v => !v);
  }

  cerrarCarrito() {
    this.mostrarCarrito.set(false);
    this.mensajeError.set(null);
  }

  procesarPago() {
    if (this.cartService.items().length === 0) {
      return;
    }

    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');

    if (!token) {
      this.mostrarMensajeTemporizado('Debes iniciar sesión para realizar el pago.');
      setTimeout(() => {
        this.cerrarCarrito();
        this.router.navigate(['/login'], { queryParams: { mensaje: 'pago_requerido' } });
      }, 2000);
      return;
    }

    this.procesandoPago.set(true);
    this.mensajeError.set(null);

    this.paymentService.createCheckoutSession(this.cartService.items()).subscribe({
      next: async (response) => {
        if (response.url) {
          await this.paymentService.redirectToCheckout(response.url);
        } else {
          this.mostrarMensajeTemporizado('Error: No se recibió la URL de pago.');
        }
        this.procesandoPago.set(false);
      },
      error: (err) => {
        console.error('Error al procesar pago:', err);
        this.mostrarMensajeTemporizado(`Error: ${err.error?.mensaje || 'Error desconocido al iniciar el pago'}`);
        this.procesandoPago.set(false);
      }
    });
  }

  private mostrarMensajeTemporizado(msg: string) {
    this.mensajeError.set(msg);
    setTimeout(() => this.mensajeError.set(null), 5000);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.carrito-container') === null) {
      this.mostrarCarrito.set(false);
    }
  }
}
