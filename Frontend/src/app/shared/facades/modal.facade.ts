import { Injectable, signal } from '@angular/core';

export interface ModalState {
  isOpen: boolean;
  isEditOpen: boolean;
  editingTask: any | null;
  isAdmin: boolean;
  isLoading: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModalFacade {
  private state = signal<ModalState>({
    isOpen: false,
    isEditOpen: false,
    editingTask: null,
    isAdmin: true, // TODO: Obter isso do AuthFacade quando tivermos a regra no token
    isLoading: false
  });

  readonly isOpen = () => this.state().isOpen;
  readonly isEditOpen = () => this.state().isEditOpen;
  readonly editingTask = () => this.state().editingTask;
  readonly isAdmin = () => this.state().isAdmin;
  readonly isLoading = () => this.state().isLoading;

  openModal() {
    this.state.update(s => ({ ...s, isOpen: true }));
  }

  closeModal() {
    this.state.update(s => ({ ...s, isOpen: false }));
  }

  createTask(taskData: any) {
    this.state.update(s => ({ ...s, isLoading: true }));
    
    // Simulate API call for now
    setTimeout(() => {
      this.state.update(s => ({ ...s, isLoading: false, isOpen: false }));
      // TODO: Após o sucesso, notificar o TasksFacade para recarregar o kanban
      console.log('Tarefa criada:', taskData);
    }, 800);
  }

  openEditModal(task: any) {
    this.state.update(s => ({ ...s, isEditOpen: true, editingTask: task }));
  }

  closeEditModal() {
    this.state.update(s => ({ ...s, isEditOpen: false, editingTask: null }));
  }

  updateTask(taskId: string, taskData: any) {
    this.state.update(s => ({ ...s, isLoading: true }));
    
    // Simulate API call for now
    setTimeout(() => {
      this.state.update(s => ({ ...s, isLoading: false, isEditOpen: false, editingTask: null }));
      console.log('Tarefa atualizada:', taskId, taskData);
    }, 800);
  }

  deleteTask(taskId: string) {
    this.state.update(s => ({ ...s, isLoading: true }));
    
    // Simulate API call for now
    setTimeout(() => {
      this.state.update(s => ({ ...s, isLoading: false, isEditOpen: false, editingTask: null }));
      console.log('Tarefa excluída:', taskId);
    }, 800);
  }
}
