// Módulo de Autenticación
//Login
//Registro
//Sesión
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styles: [`
    /* Login Premium Design - Split Screen */
    .login-container {
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }

    /* Columna del formulario (Izquierda) */
    .col-lg-6.bg-light {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Wrapper del formulario */
    .auth-card-wrapper {
      width: 100%;
      max-width: 480px;
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 24px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.18);
      position: relative;
      z-index: 2;
      margin: 1rem;
    }

    /* Títulos */
    .login-title {
      font-family: 'Inter', sans-serif;
      font-weight: 800;
      margin-bottom: 0.5rem;
      font-size: 2.2rem;
      color: #1a202c;
    }

    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .login-subtitle {
      color: #718096;
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    /* Selector de Modo - Segmented Control Premium (Pills) */
    .auth-mode-selector {
      display: flex;
      background: #e2e8f0;
      padding: 5px;
      margin-bottom: 2rem;
      border-radius: 999px;
      border: 1px solid #cbd5e0;
      width: 100%;
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    }

    .mode-btn {
      flex: 1;
      border: none;
      background: transparent;
      padding: 10px 0;
      font-weight: 600;
      color: #64748b;
      border-radius: 999px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      font-size: 1rem;
      cursor: pointer;
      text-align: center;
    }

    .mode-btn.active {
      background: white;
      color: #4c51bf; /* Indigo */
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      font-weight: 700;
      transform: scale(1.02);
    }

    .mode-btn:hover:not(.active) {
      color: #4c51bf;
      background: rgba(255,255,255,0.5);
    }

    /* Inputs */
    .form-label {
      font-weight: 600;
      color: #4a5568;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      display: block;
    }

    .input-wrapper {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #a0aec0;
      font-size: 1.2rem;
      pointer-events: none;
    }

    .form-control {
      padding: 0.85rem 1rem 0.85rem 3rem;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      background: #f7fafc;
      font-size: 1rem;
      transition: all 0.2s;
      width: 100%;
      display: block;
    }

    .form-control:focus {
      background: white;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
      outline: none;
    }

    /* Botones */
    .btn-primary {
      width: 100%;
      padding: 1rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.5px;
      margin-top: 0.5rem;
      box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
      transition: all 0.15s ease;
      color: white;
      cursor: pointer;
      text-transform: uppercase;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(1px);
    }

    /* Links */
    .link-text {
      color: #718096;
      font-size: 0.9rem;
      text-decoration: none;
      transition: color 0.2s;
    }

    .link-text:hover {
      color: #5a67d8;
      text-decoration: underline;
    }

    /* Imagen lateral */
    img {
      object-fit: cover;
      width: 100%;
      height: 100vh;
      display: block;
    }
  `]
})
export class Login {
  email: string = '';
  password: string = '';
  nombre: string = '';
  esRegistro = signal(false);
  cargando = signal(false);
  mensaje = signal('');
  tipoMensaje = signal<'exito' | 'error'>('exito');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.verificarSesionExistente();
    this.verificarMensajesContexto();
  }

  verificarMensajesContexto() {
    this.route.queryParams.subscribe(params => {
      if (params['mensaje'] === 'pago_requerido') {
        this.mostrarMensaje('Por favor inicia sesión para completar tu compra.', 'exito');
      }
    });
  }

  verificarSesionExistente() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      try {
        const datos = JSON.parse(usuario);
        if (datos.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']); // Inicio para compradores
        }
      } catch (e) {
        // Error en datos, limpiar
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
  }

  toggle() {
    this.esRegistro.update(v => !v);
    this.mensaje.set('');
    this.email = '';
    this.password = '';
    this.nombre = '';
  }

  login() {
    if (!this.email || !this.password) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    this.cargando.set(true);
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.mostrarMensaje('Inicio de sesión exitoso', 'exito');
        setTimeout(() => {
          if (response.usuario.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1500);
      },
      error: (err) => {
        this.mostrarMensaje((err.error?.mensaje || 'Error al iniciar sesión'), 'error');
        this.cargando.set(false);
      }
    });
  }

  registro() {
    if (!this.email || !this.password || !this.nombre) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    this.cargando.set(true);
    // Nota: El backend asigna 'comprador' por defecto. Para crear un admin, se debería hacer manualmente en BD o con un endpoint especial.
    this.authService.register({ email: this.email, password: this.password, nombre: this.nombre }).subscribe({
      next: (response) => {
        this.mostrarMensaje('Registro exitoso', 'exito');
        // Redirigir siempre a inicio para compradores nuevos
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        this.mostrarMensaje((err.error?.mensaje || 'Error al registrarse'), 'error');
        this.cargando.set(false);
      }
    });
  }

  private mostrarMensaje(msg: string, tipo: 'exito' | 'error') {
    this.mensaje.set(msg);
    this.tipoMensaje.set(tipo);
  }
}

