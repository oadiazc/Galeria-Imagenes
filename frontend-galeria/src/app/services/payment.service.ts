import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private stripePromise: Promise<Stripe | null>;
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        this.stripePromise = loadStripe((environment as any).stripePublishableKey);
    }

    createCheckoutSession(items: any[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/payments/create-checkout-session`, { items });
    }

    async redirectToCheckout(url: string): Promise<void> {
        // Redirigir directamente a la URL de checkout proporcionada por Stripe
        window.location.href = url;
    }

    verifySession(sessionId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/payments/verify-session/${sessionId}`);
    }

    getPurchaseHistory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/payments/historial`);
    }
}
