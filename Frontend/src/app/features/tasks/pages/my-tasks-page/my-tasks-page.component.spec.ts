import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTasksPageComponent } from './my-tasks-page.component';
import { TasksFacade } from '../../facades/tasks.facade';
import { AuthFacade } from '../../../auth/facades/auth.facade';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('MyTasksPageComponent', () => {
  let component: MyTasksPageComponent;
  let fixture: ComponentFixture<MyTasksPageComponent>;

  let mockTasksFacade: any;
  let mockAuthFacade: any;

  beforeEach(async () => {
    // Mock the signals and methods
    mockTasksFacade = {
      tasks: signal([
        { id: '1', title: 'Task 1', userId: 'user_1' },
        { id: '2', title: 'Task 2', userId: 'user_2' },
        { id: '3', title: 'Task 3', userId: 'user_1' }
      ]),
      loadTasks: vi.fn(),
      isLoading: signal(false)
    };

    mockAuthFacade = {
      userId: signal('user_1'),
      isAdmin: signal(false),
      userName: signal('User 1')
    };

    await TestBed.configureTestingModule({
      imports: [MyTasksPageComponent],
      providers: [
        { provide: TasksFacade, useValue: mockTasksFacade },
        { provide: AuthFacade, useValue: mockAuthFacade }
      ]
    })
    .overrideComponent(MyTasksPageComponent, {
      set: {
        // override template to avoid deep rendering components like TaskCard
        template: '<div>Mocked Template</div>',
        imports: []
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTasksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadTasks on init', () => {
    expect(mockTasksFacade.loadTasks).toHaveBeenCalled();
  });

  it('should strictly filter tasks to only return those assigned to the logged in user', () => {
    const filteredTasks = component.myTasks();
    expect(filteredTasks.length).toBe(2);
    expect(filteredTasks.every(t => t.userId === 'user_1')).toBe(true);
  });
});
