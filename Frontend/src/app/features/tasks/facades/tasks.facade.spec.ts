import { TestBed } from '@angular/core/testing';
import { TasksFacade } from './tasks.facade';
import { TasksService } from '../services/tasks.service';
import { NotificationFacade } from '../../../shared/facades/notification.facade';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('TasksFacade', () => {
  let facade: TasksFacade;
  let mockTasksService: any;
  let mockNotificationFacade: any;

  beforeEach(() => {
    mockTasksService = {
      getTasks: vi.fn().mockReturnValue(of([])),
      createTask: vi.fn().mockReturnValue(of({})),
      updateTask: vi.fn().mockReturnValue(of({})),
      deleteTask: vi.fn().mockReturnValue(of({}))
    };

    mockNotificationFacade = {
      success: vi.fn(),
      error: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        TasksFacade,
        { provide: TasksService, useValue: mockTasksService },
        { provide: NotificationFacade, useValue: mockNotificationFacade }
      ]
    });

    facade = TestBed.inject(TasksFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should load tasks and map assignee initials correctly', () => {
    const backendTasks = [
      { id: '1', title: 'Task 1', user: { name: 'Lucas Silva' } },
      { id: '2', title: 'Task 2', user: null }
    ];
    mockTasksService.getTasks.mockReturnValue(of(backendTasks));

    facade.loadTasks();

    expect(facade.tasks().length).toBe(2);
    expect((facade.tasks()[0] as any).assigneeInitials).toBe('LU');
    expect((facade.tasks()[0] as any).assigneeName).toBe('Lucas Silva');
    
    expect((facade.tasks()[1] as any).assigneeInitials).toBe('US');
    expect((facade.tasks()[1] as any).assigneeName).toBe('Unknown');
  });

  it('should handle error when loading tasks', () => {
    mockTasksService.getTasks.mockReturnValue(throwError(() => new Error('error')));

    facade.loadTasks();

    expect(facade.error()).toBe('Erro ao carregar tarefas');
    expect(mockNotificationFacade.error).toHaveBeenCalled();
  });

  it('should create task and reload list', () => {
    facade.createTask({ title: 'New Task' });
    expect(mockTasksService.createTask).toHaveBeenCalled();
    expect(mockTasksService.getTasks).toHaveBeenCalled(); // via loadTasks
    expect(mockNotificationFacade.success).toHaveBeenCalled();
  });

  it('should update task and reload list', () => {
    facade.updateTask('1', { title: 'Updated' });
    expect(mockTasksService.updateTask).toHaveBeenCalled();
    expect(mockTasksService.getTasks).toHaveBeenCalled();
    expect(mockNotificationFacade.success).toHaveBeenCalled();
  });

  it('should delete task and reload list', () => {
    facade.deleteTask('1');
    expect(mockTasksService.deleteTask).toHaveBeenCalled();
    expect(mockTasksService.getTasks).toHaveBeenCalled();
    expect(mockNotificationFacade.success).toHaveBeenCalled();
  });
});
