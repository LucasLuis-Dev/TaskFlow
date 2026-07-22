import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPageComponent } from './admin-page.component';
import { TasksFacade } from '../../facades/tasks.facade';
import { UsersService } from '../../../../core/services/users.service';
import { AuthFacade } from '../../../auth/facades/auth.facade';
import { NotificationFacade } from '../../../../shared/facades/notification.facade';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;

  let mockTasksFacade: any;
  let mockUsersService: any;
  let mockAuthFacade: any;
  let mockNotificationFacade: any;

  beforeEach(async () => {
    mockTasksFacade = {
      tasks: signal([]),
      loadTasks: vi.fn()
    };

    mockUsersService = {
      getUsers: vi.fn().mockReturnValue(of([{ id: '1', name: 'Admin', email: 'a@a.com', role: 'ADMIN' }])),
      updateRole: vi.fn().mockReturnValue(of({}))
    };

    mockAuthFacade = {
      userId: signal('123')
    };

    mockNotificationFacade = {
      success: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AdminPageComponent],
      providers: [
        { provide: TasksFacade, useValue: mockTasksFacade },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: NotificationFacade, useValue: mockNotificationFacade }
      ]
    })
    .overrideComponent(AdminPageComponent, {
      set: {
        template: '<div></div>', // Mock template to avoid rendering child components
        imports: []
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks and users on init', () => {
    expect(mockTasksFacade.loadTasks).toHaveBeenCalled();
    expect(mockUsersService.getUsers).toHaveBeenCalled();
    expect(component.allUsers.length).toBe(1);
    expect(component.allUsers[0].name).toBe('Admin');
  });

  it('should change user role', () => {
    component.changeUserRole('user_2', 'USER');
    expect(mockUsersService.updateRole).toHaveBeenCalledWith('user_2', 'USER');
    expect(mockNotificationFacade.success).toHaveBeenCalled();
  });

  it('should calculate initials properly', () => {
    expect(component.getInitials('Lucas Silva')).toBe('LS');
    expect(component.getInitials('Ana')).toBe('AN');
    expect(component.getInitials('A')).toBe('A');
    expect(component.getInitials('')).toBe('US');
  });
});
