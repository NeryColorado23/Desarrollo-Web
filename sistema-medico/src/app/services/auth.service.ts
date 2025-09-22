import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'medical_system_auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  // Usuarios predefinidos para el sistema
  private validUsers = [
    { username: 'admin', password: 'admin123', role: 'Administrador' },
    { username: 'doctor', password: 'doctor123', role: 'Doctor' },
    { username: 'recepcion', password: 'recepcion123', role: 'Recepcionista' }
  ];

  constructor() {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    const savedAuth = localStorage.getItem(this.STORAGE_KEY);
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        const isExpired = Date.now() > authData.expiresAt;

        if (!isExpired) {
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(authData.user);
        } else {
          this.clearAuthState();
        }
      } catch (error) {
        this.clearAuthState();
      }
    }
  }

  private saveAuthState(user: User): void {
    const authData = {
      user,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
  }

  private clearAuthState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  login(username: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.validUsers.find(u =>
          u.username === username && u.password === password
        );

        if (user) {
          const userData: User = { username: user.username, role: user.role };
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(userData);
          this.saveAuthState(userData);

          observer.next({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: userData
          });
        } else {
          observer.next({
            success: false,
            message: 'Usuario o contraseña incorrectos'
          });
        }
        observer.complete();
      }, 1000); // Simular delay de red
    });
  }

  logout(): void {
    this.clearAuthState();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
