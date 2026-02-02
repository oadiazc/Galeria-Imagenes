import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    currentUser = signal<User | null>(null);

    constructor(private http: HttpClient, private router: Router) {
        const savedUser = localStorage.getItem('usuario');
        if (savedUser) {
            this.currentUser.set(JSON.parse(savedUser));
        }
    }

    login(credentials: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => this.handleAuthResponse(response))
        );
    }

    register(data: { email: string; password: string; nombre: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(response => this.handleAuthResponse(response))
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private handleAuthResponse(response: AuthResponse) {
        if (response.token && response.usuario) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            this.currentUser.set(response.usuario);
        }
    }
}
