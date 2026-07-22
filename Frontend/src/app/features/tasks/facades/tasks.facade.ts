import { Injectable, inject, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { TasksService } from '../services/tasks.service';
import { NotificationFacade } from '../../../shared/facades/notification.facade';

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
  private notification = inject(NotificationFacade);

  private state = signal<TasksState>({
    tasks: [],
    isLoading: false,
    error: null
  });

  readonly tasks = () => this.state().tasks;
  readonly isLoading = () => this.state().isLoading;
  readonly error = () => this.state().error;

  uploadFiles(files: File[]) {
    return this.tasksService.uploadFiles(files);
  }

  loadTasks(silent = false) {
    if (!silent) {
      this.state.update(s => ({ ...s, isLoading: true, error: null }));
    }
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
        this.notification.error('Erro', 'Não foi possível carregar as tarefas.');
      }
    });
  }

  createTask(task: Partial<Task>, onComplete?: (success: boolean) => void) {
    this.tasksService.createTask(task).subscribe({
      next: () => {
        this.loadTasks(true);
        this.notification.success('Sucesso', 'Tarefa criada com sucesso!');
        if (onComplete) onComplete(true);
      },
      error: () => {
        this.state.update(s => ({ ...s, isLoading: false, error: 'Erro ao criar tarefa' }));
        this.notification.error('Erro', 'Não foi possível criar a tarefa.');
        if (onComplete) onComplete(false);
      }
    });
  }

  updateTask(id: string, task: Partial<Task>, onComplete?: (success: boolean) => void) {
    this.tasksService.updateTask(id, task).subscribe({
      next: () => {
        this.loadTasks(true);
        this.notification.success('Sucesso', 'Tarefa atualizada com sucesso!');
        if (onComplete) onComplete(true);
      },
      error: () => {
        this.state.update(s => ({ ...s, isLoading: false, error: 'Erro ao atualizar tarefa' }));
        this.notification.error('Erro', 'Não foi possível atualizar a tarefa.');
        if (onComplete) onComplete(false);
      }
    });
  }

  deleteTask(id: string, onComplete?: (success: boolean) => void) {
    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks(true);
        this.notification.success('Excluída', 'Tarefa excluída com sucesso.');
        if (onComplete) onComplete(true);
      },
      error: () => {
        this.state.update(s => ({ ...s, isLoading: false, error: 'Erro ao excluir tarefa' }));
        this.notification.error('Erro', 'Não foi possível excluir a tarefa.');
        if (onComplete) onComplete(false);
      }
    });
  }
}
