import { TestBed } from '@angular/core/testing';
import { AuthFacade } from './auth.facade';
import { AuthService } from '../services/auth.service';
import { NotificationFacade } from '../../../shared/facades/notification.facade';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let mockAuthService: any;
  let mockNotificationFacade: any;
  let mockRouter: any;

  // Mock JWT for test: header.payload.signature
  // Payload: { "role": "ADMIN", "name": "Lucas", "email": "test@test.com", "sub": "123" }
  const mockToken = 'header.eyJyb2xlIjoiQURNSU4iLCJuYW1lIjoiTHVjYXMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJzdWIiOiIxMjMifQ==.signature';

  beforeEach(() => {
    mockAuthService = {
      login: vi.fn().mockReturnValue(of({ access_token: mockToken })),
      register: vi.fn().mockReturnValue(of({}))
    };

    mockNotificationFacade = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationFacade, useValue: mockNotificationFacade },
        { provide: Router, useValue: mockRouter }
      ]
    });
    
    // Clear localStorage before each test
    localStorage.clear();
    facade = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should login, set token, and parse JWT payload correctly', () => {
    facade.login({ email: 'test@test.com', password: 'pwd' });

    expect(localStorage.getItem('access_token')).toBe(mockToken);
    expect(facade.isAuthenticated()).toBe(true);
    expect(facade.isAdmin()).toBe(true);
    expect(facade.userName()).toBe('Lucas');
    expect(facade.userEmail()).toBe('test@test.com');
    expect(facade.userId()).toBe('123');
    
    expect(mockNotificationFacade.success).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should handle login error', () => {
    mockAuthService.login.mockReturnValue(throwError(() => ({ status: 401 })));

    facade.login({ email: 'test@test.com', password: 'wrong' });

    expect(facade.error()).toBe('E-mail ou senha inválidos.');
    expect(mockNotificationFacade.error).toHaveBeenCalled();
  });

  it('should logout and clear state', () => {
    // Setup state
    localStorage.setItem('access_token', mockToken);
    
    facade.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(facade.isAuthenticated()).toBe(false);
    expect(facade.isAdmin()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
