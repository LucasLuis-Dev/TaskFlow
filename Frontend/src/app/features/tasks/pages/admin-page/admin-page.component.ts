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

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

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
    TableModule
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  private tasksFacade = inject(TasksFacade);
  
  ngOnInit() {
    this.tasksFacade.loadTasks();
  }

  public searchFilter = '';
  public selectedUser = null;
  public selectedStatus = null;
  public selectedPriority = null;

  public userOptions = [
    { label: 'Todos usuários', value: null },
    { label: 'Admin Master', value: 'Admin Master' },
    { label: 'Ana Silva', value: 'Ana Silva' }
  ];

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
