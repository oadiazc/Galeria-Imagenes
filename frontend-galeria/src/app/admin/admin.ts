import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {

  imagenes = signal<any[]>([]);
  cargando = signal(true);
  tokenValido = signal(false);
  mostrarModalEditar = signal(false);
  mostrarConfirmarEliminar = signal(false);
  guardando = signal(false);
  eliminando = signal(false);
  mensaje = signal('');
  tipoMensaje = signal<'exito' | 'error'>('exito');

  terminoBusqueda = signal('');
  filtroCategoria = signal('');

  imagenesFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    const categoria = this.filtroCategoria();

    return this.imagenes().filter(img => {
      const coincideTexto = img.titulo.toLowerCase().includes(termino) ||
        img.autor.toLowerCase().includes(termino);
      const coincideCategoria = categoria ? img.categoria === categoria : true;

      return coincideTexto && coincideCategoria;
    });
  });

  imagenEditando: any = {};
  idImagenEliminar = '';

  constructor(private http: HttpClient, private router: Router) {
    this.verificarToken();
  }

  ngOnInit() {
    if (this.tokenValido()) {
      this.cargarImagenes();
    }
  }

  verificarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenValido.set(true);
    } else {
      this.tokenValido.set(false);
      this.router.navigate(['/login']);
    }
  }

  cargarImagenes() {
    this.cargando.set(true);
    this.http.get<any[]>(`${API_URL}/images`).subscribe({
      next: (data) => {
        this.imagenes.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
      }
    });
  }

  abrirModalEditar(imagen: any) {
    this.imagenEditando = { ...imagen };
    this.mostrarModalEditar.set(true);
  }

  cerrarModalEditar() {
    this.mostrarModalEditar.set(false);
    this.mensaje.set('');
  }

  guardarCambios() {
    this.guardando.set(true);
    const headers = this.getAuthHeaders();

    this.http.put(`${API_URL}/images/${this.imagenEditando._id}`, this.imagenEditando, { headers })
      .subscribe({
        next: () => {
          this.mensaje.set('Imagen actualizada exitosamente');
          this.tipoMensaje.set('exito');
          this.guardando.set(false);
          setTimeout(() => {
            this.cerrarModalEditar();
            this.cargarImagenes();
          }, 1500);
        },
        error: () => {
          this.mensaje.set('Error al actualizar imagen');
          this.tipoMensaje.set('error');
          this.guardando.set(false);
        }
      });
  }

  confirmarEliminar(id: string) {
    this.idImagenEliminar = id;
    this.mostrarConfirmarEliminar.set(true);
  }

  cancelarEliminar() {
    this.mostrarConfirmarEliminar.set(false);
    this.idImagenEliminar = '';
  }

  eliminarImagen() {
    this.eliminando.set(true);
    const headers = this.getAuthHeaders();

    this.http.delete(`${API_URL}/images/${this.idImagenEliminar}`, { headers })
      .subscribe({
        next: () => {
          this.cancelarEliminar();
          this.eliminando.set(false);
          this.cargarImagenes();
        },
        error: (err) => {
          console.error('Error al eliminar imagen:', err);
          this.eliminando.set(false);
        }
      });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }
}
