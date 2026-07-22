import { Injectable, inject, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { TasksService } from '../services/tasks.service';

export interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TasksFacade {
  private tasksService = inject(TasksService);

  private state = signal<TasksState>({
    tasks: [],
    isLoading: false,
    error: null
  });

  readonly tasks = () => this.state().tasks;
  readonly isLoading = () => this.state().isLoading;
  readonly error = () => this.state().error;

  loadTasks() {
    this.state.update(s => ({ ...s, isLoading: true, error: null }));
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        // Backend maps user object, so we might need to map it to initials/name
        // if the backend response looks like { user: { name: '...' } }
        const mappedTasks = tasks.map((t: any) => ({
          ...t,
          assigneeInitials: t.user ? t.user.name.substring(0, 2).toUpperCase() : 'US',
          assigneeName: t.user ? t.user.name : 'Unknown'
        }));
        
        this.state.update(s => ({ ...s, tasks: mappedTasks, isLoading: false }));
      },
      error: (err) => {
        this.state.update(s => ({ ...s, error: 'Erro ao carregar tarefas', isLoading: false }));
      }
    });
  }

  createTask(task: Partial<Task>, onSuccess?: () => void) {
    this.state.update(s => ({ ...s, isLoading: true }));
    this.tasksService.createTask(task).subscribe({
      next: () => {
        this.loadTasks();
        if (onSuccess) onSuccess();
      },
      error: () => {
        this.state.update(s => ({ ...s, isLoading: false, error: 'Erro ao criar tarefa' }));
      }
    });
  }

  updateTask(id: string, task: Partial<Task>, onSuccess?: () => void) {
    this.state.update(s => ({ ...s, isLoading: true }));
    this.tasksService.updateTask(id, task).subscribe({
      next: () => {
        this.loadTasks();
        if (onSuccess) onSuccess();
      },
      error: () => {
        this.state.update(s => ({ ...s, isLoading: false, error: 'Erro ao atualizar tarefa' }));
      }
    });
  }

  deleteTask(id: string, onSuccess?: () => void) {
    this.state.update(s => ({ ...s, isLoading: true }));
    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
        if (onSuccess) onSuccess();
      },
      error: () => {
        this.state.update(s => ({ ...s, isLoading: false, error: 'Erro ao excluir tarefa' }));
      }
    });
  }
}
