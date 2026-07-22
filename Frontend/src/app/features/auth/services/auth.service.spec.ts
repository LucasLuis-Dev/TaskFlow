import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpService } from '../../../core/services/http.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttpService: any;

  beforeEach(() => {
    mockHttpService = {
      post: vi.fn().mockReturnValue(of({ access_token: 'token' }))
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useValue: mockHttpService }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should login and call API', () => {
    const creds = { email: 'e', password: 'p' };
    service.login(creds);
    expect(mockHttpService.post).toHaveBeenCalledWith('auth/login', creds);
  });

  it('should register and call API', () => {
    const creds = { name: 'N', email: 'e', password: 'p' };
    service.register(creds);
    expect(mockHttpService.post).toHaveBeenCalledWith('auth/register', creds);
  });
});
