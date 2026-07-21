import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginCredentials, RegisterCredentials } from '../models/auth.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpService = inject(HttpService);

  login(credentials: LoginCredentials): Observable<{ access_token: string }> {
    return this.httpService.post<{ access_token: string }>('auth/login', credentials);
  }

  register(credentials: RegisterCredentials): Observable<{ access_token: string }> {
    return this.httpService.post<{ access_token: string }>('auth/register', credentials);
  }
}
