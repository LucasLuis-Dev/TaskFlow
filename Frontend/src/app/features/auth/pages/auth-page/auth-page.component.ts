import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '../../facades/auth.facade';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { LoginCredentials, RegisterCredentials } from '../../models/auth.model';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  private authFacade = inject(AuthFacade);

  // State using Signal for the toggle
  mode = signal<'login' | 'register'>('login');

  // Facade selectors
  isLoading = this.authFacade.isLoading;
  error = this.authFacade.error;

  onLoginSubmit(credentials: LoginCredentials) {
    this.authFacade.login(credentials);
  }

  onRegisterSubmit(credentials: RegisterCredentials) {
    this.authFacade.register(credentials, () => {
      this.switchMode('login');
    });
  }

  switchMode(newMode: 'login' | 'register') {
    this.mode.set(newMode);
    // Optional: Clear errors when switching modes
    // this.authFacade.clearError(); // Needs implementation in facade if desired
  }
}
