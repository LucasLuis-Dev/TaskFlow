import { TestBed } from '@angular/core/testing';
import { TasksService } from './tasks.service';
import { HttpService } from '../../../core/services/http.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('TasksService', () => {
  let service: TasksService;
  let mockHttpService: any;

  beforeEach(() => {
    mockHttpService = {
      get: vi.fn().mockReturnValue(of([])),
      post: vi.fn().mockReturnValue(of({})),
      patch: vi.fn().mockReturnValue(of({})),
      delete: vi.fn().mockReturnValue(of({})),
      upload: vi.fn().mockReturnValue(of({}))
    };

    TestBed.configureTestingModule({
      providers: [
        TasksService,
        { provide: HttpService, useValue: mockHttpService }
      ]
    });

    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getTasks', () => {
    service.getTasks();
    expect(mockHttpService.get).toHaveBeenCalledWith('tasks');
  });

  it('should createTask', () => {
    const task = { title: 'Test' };
    service.createTask(task);
    expect(mockHttpService.post).toHaveBeenCalledWith('tasks', task);
  });

  it('should updateTask', () => {
    const task = { title: 'Updated' };
    service.updateTask('1', task);
    expect(mockHttpService.patch).toHaveBeenCalledWith('tasks/1', task);
  });

  it('should deleteTask', () => {
    service.deleteTask('1');
    expect(mockHttpService.delete).toHaveBeenCalledWith('tasks/1');
  });
});
