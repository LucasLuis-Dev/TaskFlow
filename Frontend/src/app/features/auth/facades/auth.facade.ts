import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthState, LoginCredentials, RegisterCredentials } from '../models/auth.model';
import { Router } from '@angular/router';
import { NotificationFacade } from '../../../shared/facades/notification.facade';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationFacade);

  private state = signal<AuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    isAdmin: this.checkIfAdmin(localStorage.getItem('access_token')),
    userName: this.getUserName(localStorage.getItem('access_token')),
    userEmail: this.getUserEmail(localStorage.getItem('access_token'))
  });

  readonly isLoading = () => this.state().isLoading;
  readonly error = () => this.state().error;
  readonly isAuthenticated = () => this.state().isAuthenticated;
  readonly isAdmin = () => this.state().isAdmin;
  readonly userName = () => this.state().userName;
  readonly userEmail = () => this.state().userEmail;

  login(credentials: LoginCredentials): void {
    this.state.update(s => ({ ...s, isLoading: true, error: null }));
    
    this.authService.login(credentials).subscribe({
      next: (res) => this.handleAuthSuccess(res.access_token),
      error: (err) => this.handleAuthError(err)
    });
  }

  register(credentials: RegisterCredentials, onSuccess?: () => void): void {
    this.state.update(s => ({ ...s, isLoading: true, error: null }));
    
    this.authService.register(credentials).subscribe({
      next: () => {
        this.state.update(s => ({ ...s, isLoading: false }));
        this.notification.success('Conta criada!', 'Faça login para continuar.');
        if (onSuccess) onSuccess();
      },
      error: (err) => this.handleAuthError(err)
    });
  }

  private handleAuthSuccess(token: string): void {
    localStorage.setItem('access_token', token);
    const isAdmin = this.checkIfAdmin(token);
    const userName = this.getUserName(token);
    const userEmail = this.getUserEmail(token);
    this.state.update(s => ({ ...s, isAuthenticated: true, isLoading: false, isAdmin, userName, userEmail }));
    this.notification.success('Bem-vindo!', 'Login realizado com sucesso.');
    this.router.navigate(['/tasks']);
  }

  private handleAuthError(err: any): void {
    let errorMessage = 'Erro ao autenticar. Verifique seus dados.';
    if (err.status === 401) {
      errorMessage = 'E-mail ou senha inválidos.';
    } else if (err.error?.message) {
      errorMessage = Array.isArray(err.error.message) ? err.error.message[0] : err.error.message;
    }
    
    this.state.update(s => ({ 
      ...s, 
      error: errorMessage, 
      isLoading: false 
    }));
    this.notification.error('Falha na autenticação', errorMessage);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.state.update(s => ({ ...s, isAuthenticated: false, isAdmin: false, userName: '', userEmail: '' }));
    this.notification.info('Sessão encerrada', 'Você saiu da sua conta.');
    this.router.navigate(['/auth']);
  }

  private checkIfAdmin(token: string | null): boolean {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ADMIN';
    } catch (e) {
      return false;
    }
  }

  private getUserName(token: string | null): string {
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name || 'Usuário';
    } catch (e) {
      return 'Usuário';
    }
  }

  private getUserEmail(token: string | null): string {
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || '';
    } catch (e) {
      return '';
    }
  }
}
