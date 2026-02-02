import { Component, signal, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuPrincipal } from "./global/menu-principal/menu-principal";
import { Footer } from "./global/footer/footer";
import { CarritoCompra } from './components/carrito-compra/carrito-compra';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MenuPrincipal, Footer, CarritoCompra],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-galeria');

  constructor(public authService: AuthService) { }
}
