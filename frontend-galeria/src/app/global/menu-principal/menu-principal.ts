// Módulo Global
//Menú Principal
//presente en toda la aplicación

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-principal.html',
  styleUrl: './menu-principal.css',
})
export class MenuPrincipal {

  isMenuOpen = signal(false);

  constructor(public authService: AuthService) { }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
}
// Recompilación forzada


