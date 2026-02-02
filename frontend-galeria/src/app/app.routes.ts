import { Routes } from '@angular/router';
import { Inicio } from './funcionalidades/inicio/inicio';
import { Galeria } from './funcionalidades/galeria/galeria';
import { AdminComponent } from './admin/admin';
import { SubirImagen } from './subir-imagen/subir-imagen';
import { authGuard } from './guards/auth.guard';
import { Login } from './autenticacion/login/login';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';
import { SobreNosotros } from './funcionalidades/sobre-nosotros/sobre-nosotros';
import { MisFavoritos } from './funcionalidades/mis-favoritos/mis-favoritos';
import { MisComprasComponent } from './funcionalidades/mis-compras/mis-compras.component';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio },
  { path: 'galeria', component: Galeria },
  { path: 'sobre-nosotros', component: SobreNosotros },
  { path: 'mis-favoritos', component: MisFavoritos, canActivate: [authGuard] },
  { path: 'mis-compras', component: MisComprasComponent, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'subir-imagen', component: SubirImagen, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-cancel', component: PaymentCancelComponent },
  { path: '**', redirectTo: '' }
];
