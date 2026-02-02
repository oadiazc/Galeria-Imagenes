import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-payment-success',
    imports: [CommonModule, RouterModule],
    templateUrl: './payment-success.component.html',
    styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
    loading = signal(true);
    orderDetails = signal<any>(null);

    constructor(
        private route: ActivatedRoute,
        private paymentService: PaymentService,
        private cartService: CartService
    ) { }

    ngOnInit() {
        const sessionId = this.route.snapshot.queryParamMap.get('session_id');
        if (sessionId) {
            this.paymentService.verifySession(sessionId).subscribe({
                next: (data) => {
                    this.orderDetails.set(data.orden);
                    this.loading.set(false);
                    // Limpiar el carrito si el pago fue exitoso
                    if (data.estado === 'paid') {
                        this.cartService.limpiarCarrito();
                    }
                },
                error: (err) => {
                    console.error('Error al verificar pago:', err);
                    this.loading.set(false);
                }
            });
        } else {
            this.loading.set(false);
        }
    }
}
