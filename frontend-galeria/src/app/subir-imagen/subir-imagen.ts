import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

// Usamos environment
const API_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-subir-imagen',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './subir-imagen.html',
  styleUrl: './subir-imagen.css',
})
export class SubirImagen {
  titulo = '';
  autor = '';
  descripcion = '';
  categoria = '';
  precio = 100;
  stock = 1;

  cargando = signal(false);
  mensaje = signal('');
  tipoMensaje = signal<'exito' | 'error'>('exito');
  tokenValido = signal(false);
  archivoSeleccionado = signal(false);
  nombreArchivo = signal('');

  private archivoFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.verificarToken();
  }

  verificarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenValido.set(true);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoFile = file;
      this.nombreArchivo.set(file.name);
      this.archivoSeleccionado.set(true);
    }
  }

  subirImagen() {
    if (!this.titulo || !this.autor || !this.categoria || !this.archivoFile) {
      this.mostrarMensaje('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    this.cargando.set(true);

    const formData = new FormData();
    formData.append('titulo', this.titulo);
    formData.append('autor', this.autor);
    formData.append('descripcion', this.descripcion);
    formData.append('categoria', this.categoria);
    formData.append('precio', this.precio.toString());
    formData.append('stock', this.stock.toString());
    formData.append('imagen', this.archivoFile, this.archivoFile.name);

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.post<any>(`${API_URL}/images`, formData, { headers })
      .subscribe({
        next: (data) => {
          this.mostrarMensaje('Imagen subida exitosamente', 'exito');
          this.limpiarFormulario();
          this.cargando.set(false);
          setTimeout(() => this.router.navigate(['/admin']), 1500);
        },
        error: (err) => {
          this.mostrarMensaje((err.error?.mensaje || 'Error al subir imagen'), 'error');
          this.cargando.set(false);
        }
      });
  }

  private limpiarFormulario() {
    this.titulo = '';
    this.autor = '';
    this.descripcion = '';
    this.categoria = '';
    this.precio = 100;
    this.stock = 1;
    this.archivoFile = null;
    this.archivoSeleccionado.set(false);
    this.nombreArchivo.set('');
  }

  private mostrarMensaje(msg: string, tipo: 'exito' | 'error') {
    this.mensaje.set(msg);
    this.tipoMensaje.set(tipo);
  }
}
