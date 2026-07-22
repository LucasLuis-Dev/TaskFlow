import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpService } from './http.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('UsersService', () => {
  let service: UsersService;
  let mockHttpService: any;

  beforeEach(() => {
    mockHttpService = {
      get: vi.fn().mockReturnValue(of([])),
      patch: vi.fn().mockReturnValue(of({}))
    };

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: HttpService, useValue: mockHttpService }
      ]
    });

    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get on users endpoint', () => {
    service.getUsers();
    expect(mockHttpService.get).toHaveBeenCalledWith('users');
  });

  it('should call patch on users role endpoint', () => {
    service.updateRole('123', 'ADMIN');
    expect(mockHttpService.patch).toHaveBeenCalledWith('users/123/role', { role: 'ADMIN' });
  });
});
