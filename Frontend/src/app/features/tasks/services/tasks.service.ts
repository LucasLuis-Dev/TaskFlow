import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpService);

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('tasks');
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`tasks/${id}`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>('tasks', task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`tasks/${id}`);
  }

  uploadFiles(files: File[]): Observable<any[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post<any[]>('uploads', formData);
  }
}
