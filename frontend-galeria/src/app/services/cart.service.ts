import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface CartItem {
  _id: string;
  titulo: string;
  autor: string;
  descripcion: string;
  categoria: string;
  url: string;
  precio: number;
  cantidad: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>(this.cargarDelLocalStorage());

  constructor() { }

  agregarAlCarrito(imagen: any): boolean {
    const items = this.items();
    const existente = items.find(item => item._id === imagen._id);

    if (existente) {
      if (existente.cantidad + 1 > existente.stock) {
        return false; // No hay suficiente stock
      }
      existente.cantidad += 1;
    } else {
      if (imagen.stock < 1) {
        return false; // No hay stock inicial
      }
      items.push({
        _id: imagen._id,
        titulo: imagen.titulo,
        autor: imagen.autor,
        descripcion: imagen.descripcion,
        categoria: imagen.categoria,
        url: imagen.url,
        precio: imagen.precio,
        cantidad: 1,
        stock: imagen.stock
      });
    }

    this.items.set([...items]);
    this.guardarEnLocalStorage();
    return true;
  }

  removerDelCarrito(id: string) {
    const items = this.items().filter(item => item._id !== id);
    this.items.set(items);
    this.guardarEnLocalStorage();
  }

  actualizarCantidad(id: string, cantidad: number) {
    const items = this.items();
    const item = items.find(i => i._id === id);
    if (item) {
      // Validar que no exceda el stock y que sea al menos 1
      const nuevaCantidad = Math.min(Math.max(1, cantidad), item.stock);
      item.cantidad = nuevaCantidad;
      this.items.set([...items]);
      this.guardarEnLocalStorage();
    }
  }

  obtenerTotal(): number {
    return this.items().reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  obtenerCantidadItems(): number {
    return this.items().reduce((total, item) => total + item.cantidad, 0);
  }

  limpiarCarrito() {
    this.items.set([]);
    localStorage.removeItem('carrito');
  }

  private guardarEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.items()));
  }

  private cargarDelLocalStorage(): CartItem[] {
    const data = localStorage.getItem('carrito');
    return data ? JSON.parse(data) : [];
  }
}
