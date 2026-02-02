export interface User {
    _id?: string;
    email: string;
    nombre?: string;
    password?: string;
    rol?: 'admin' | 'comprador';
    createdAt?: Date;
}

export interface AuthResponse {
    mensaje: string;
    token: string;
    usuario: User;
}
