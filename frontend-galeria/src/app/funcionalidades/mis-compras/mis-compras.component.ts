import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-mis-compras',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './mis-compras.component.html',
    styleUrls: ['./mis-compras.component.css']
})
export class MisComprasComponent implements OnInit {
    private paymentService = inject(PaymentService);

    compras = signal<any[]>([]);
    loading = signal<boolean>(true);

    ngOnInit() {
        this.cargarHistorial();
    }

    cargarHistorial() {
        this.paymentService.getPurchaseHistory().subscribe({
            next: (data) => {
                this.compras.set(data);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error al cargar historial', error);
                this.loading.set(false);
            }
        });
    }
}
