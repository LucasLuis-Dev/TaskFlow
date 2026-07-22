import { Injectable, inject, signal } from '@angular/core';
import { TasksFacade } from '../../features/tasks/facades/tasks.facade';
import { UsersService } from '../../core/services/users.service';
import { AuthFacade } from '../../features/auth/facades/auth.facade';

export interface ModalState {
  isOpen: boolean;
  isEditOpen: boolean;
  editingTask: any | null;
  isLoading: boolean;
  users: { label: string, value: string }[];
}

@Injectable({ providedIn: 'root' })
export class ModalFacade {
  private tasksFacade = inject(TasksFacade);
  private usersService = inject(UsersService);
  private authFacade = inject(AuthFacade);

  private state = signal<ModalState>({
    isOpen: false,
    isEditOpen: false,
    editingTask: null,
    isLoading: false,
    users: []
  });

  readonly isOpen = () => this.state().isOpen;
  readonly isEditOpen = () => this.state().isEditOpen;
  readonly editingTask = () => this.state().editingTask;
  readonly isAdmin = () => this.authFacade.isAdmin();
  readonly isLoading = () => this.state().isLoading;
  readonly users = () => this.state().users;

  loadUsers() {
    if (this.isAdmin() && this.users().length === 0) {
      this.usersService.getUsers().subscribe({
        next: (users) => {
          const userOptions = users.map(u => ({ label: u.name, value: u.id }));
          this.state.update(s => ({ ...s, users: userOptions }));
        },
        error: (err) => console.error('Error fetching users', err)
      });
    }
  }

  openModal() {
    this.loadUsers();
    this.state.update(s => ({ ...s, isOpen: true }));
  }

  closeModal() {
    this.state.update(s => ({ ...s, isOpen: false }));
  }

  createTask(taskData: any) {
    this.state.update(s => ({ ...s, isLoading: true }));
    
    this.tasksFacade.createTask(taskData, () => {
      this.state.update(s => ({ ...s, isLoading: false, isOpen: false }));
    });
  }

  openEditModal(task: any) {
    this.loadUsers();
    this.state.update(s => ({ ...s, isEditOpen: true, editingTask: task }));
  }

  closeEditModal() {
    this.state.update(s => ({ ...s, isEditOpen: false, editingTask: null }));
  }

  updateTask(taskId: string, taskData: any) {
    this.state.update(s => ({ ...s, isLoading: true }));
    
    this.tasksFacade.updateTask(taskId, taskData, () => {
      this.state.update(s => ({ ...s, isLoading: false, isEditOpen: false, editingTask: null }));
    });
  }

  uploadAndSaveTask(taskId: string, taskData: any, files: File[]) {
    this.state.update(s => ({ ...s, isLoading: true }));
    
    // First upload the files
    this.tasksFacade.uploadFiles(files).subscribe({
      next: (uploadResult) => {
        // uploadResult is an array of { fileUrl, fileName, fileType }
        taskData.attachments = uploadResult;
        
        // Then update the task with attachments
        this.tasksFacade.updateTask(taskId, taskData, () => {
          this.state.update(s => ({ ...s, isLoading: false, isEditOpen: false, editingTask: null }));
        });
      },
      error: () => {
        this.state.update(s => ({ ...s, isLoading: false }));
        console.error('Error uploading files');
      }
    });
  }

  deleteTask(taskId: string) {
    this.state.update(s => ({ ...s, isLoading: true }));
    
    this.tasksFacade.deleteTask(taskId, () => {
      this.state.update(s => ({ ...s, isLoading: false, isEditOpen: false, editingTask: null }));
    });
  }
}
