import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

// ===================================
// Interface User
// ===================================
export interface User {
  id: number;
  nome: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // BehaviorSubject com tipagem User | null
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Carrega usuário do localStorage se existir
    const user = localStorage.getItem('usuario');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // ===================================
  // Login: atualiza BehaviorSubject e salva no localStorage
  // ===================================
  login(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('usuario', JSON.stringify(user));
  }

  // ===================================
  // Logout: limpa BehaviorSubject e localStorage
  // ===================================
  logout(): Observable<void> {
    this.currentUserSubject.next(null);
    localStorage.removeItem('usuario');
    return of(); // Retorna Observable vazio para compatibilidade com .subscribe()
  }

  // ===================================
  // Retorna usuário atual (sincrono)
  // ===================================
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
