import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { Task } from '../../models/task.model';
import { CreateTaskModalComponent } from '../../../../shared/components/modals/create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../../../../shared/components/modals/edit-task-modal/edit-task-modal.component';
import { TasksFacade } from '../../facades/tasks.facade';
import { UsersService, User as UserModel } from '../../../../core/services/users.service';
import { AuthFacade } from '../../../auth/facades/auth.facade';
import { NotificationFacade } from '../../../../shared/facades/notification.facade';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';

interface TaskExt extends Task {
  assigneeName?: string;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    SidebarComponent, 
    HeaderComponent, 
    MetricCardComponent,
    CreateTaskModalComponent,
    EditTaskModalComponent,
    InputTextModule,
    SelectModule,
    TableModule,
    SkeletonModule,
    ProgressBarModule
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  public tasksFacade = inject(TasksFacade);
  public usersService = inject(UsersService);
  public authFacade = inject(AuthFacade);
  public notification = inject(NotificationFacade);
  
  public allUsers: UserModel[] = [];
  public usersLoading = false;

  public roleOptions = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Usuário', value: 'USER' }
  ];

  ngOnInit() {
    this.tasksFacade.loadTasks();
    this.loadUsers();
  }

  loadUsers() {
    this.usersLoading = true;
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.usersLoading = false;
      },
      error: () => {
        this.usersLoading = false;
      }
    });
  }

  changeUserRole(userId: string, newRole: string) {
    this.usersService.updateRole(userId, newRole).subscribe({
      next: () => {
        this.notification.success('Sucesso', 'Cargo do usuário atualizado.');
        this.loadUsers(); // reload to get fresh data
      },
      error: () => {
        this.notification.error('Erro', 'Não foi possível alterar o cargo.');
      }
    });
  }

  getInitials(name: string) {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  public searchFilter = '';
  public selectedUser = null;
  public selectedStatus = null;
  public selectedPriority = null;

  get userOptions() {
    const tasks = this.tasksFacade.tasks() as TaskExt[];
    const uniqueUsers = Array.from(new Set(tasks.map(t => t.assigneeName).filter(Boolean)));
    const options = uniqueUsers.map(name => ({ label: name, value: name }));
    return [{ label: 'Todos usuários', value: null }, ...options];
  }

  public statusOptions = [
    { label: 'Todos status', value: null },
    { label: 'Pendente', value: 'PENDING' },
    { label: 'Em andamento', value: 'IN_PROGRESS' },
    { label: 'Concluída', value: 'COMPLETED' }
  ];

  public priorityOptions = [
    { label: 'Todas prioridades', value: null },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Média', value: 'MEDIA' },
    { label: 'Baixa', value: 'BAIXA' }
  ];

  get filteredTasks() {
    let filtered = this.tasksFacade.tasks() as TaskExt[];

    if (this.searchFilter) {
      filtered = filtered.filter(t => t.title.toLowerCase().includes(this.searchFilter.toLowerCase()));
    }
    if (this.selectedUser) {
      filtered = filtered.filter(t => t.assigneeName === this.selectedUser);
    }
    if (this.selectedStatus) {
      filtered = filtered.filter(t => t.status === this.selectedStatus);
    }
    if (this.selectedPriority) {
      filtered = filtered.filter(t => t.priority === this.selectedPriority);
    }

    return filtered;
  }

  getStatusClass(status: string) {
    if (status === 'PENDING') return 'badge-pending';
    if (status === 'IN_PROGRESS') return 'badge-inprogress';
    if (status === 'COMPLETED') return 'badge-completed';
    return '';
  }

  getStatusLabel(status: string) {
    if (status === 'PENDING') return 'Pendente';
    if (status === 'IN_PROGRESS') return 'Em andamento';
    if (status === 'COMPLETED') return 'Concluída';
    return status;
  }

  get totalTasks() {
    return this.tasksFacade.tasks().length;
  }

  get pendingTasks() {
    return this.tasksFacade.tasks().filter(t => t.status === 'PENDING').length;
  }

  get inProgressTasks() {
    return this.tasksFacade.tasks().filter(t => t.status === 'IN_PROGRESS').length;
  }

  get completedTasks() {
    return this.tasksFacade.tasks().filter(t => t.status === 'COMPLETED').length;
  }

  get overdueTasks() {
    const now = new Date();
    // Assuming deadline format is 'dd/mm/yyyy' in frontend view or 'YYYY-MM-DDTHH:mm...'
    return this.tasksFacade.tasks().filter(t => {
      if (!t.deadline || t.status === 'COMPLETED') return false;
      const d = new Date(t.deadline);
      return d < now;
    }).length;
  }

  get pendingPercentage() {
    if (this.totalTasks === 0) return 0;
    return (this.pendingTasks / this.totalTasks) * 100;
  }

  get inProgressPercentage() {
    if (this.totalTasks === 0) return 0;
    return (this.inProgressTasks / this.totalTasks) * 100;
  }

  get completedPercentage() {
    if (this.totalTasks === 0) return 0;
    return (this.completedTasks / this.totalTasks) * 100;
  }
}
