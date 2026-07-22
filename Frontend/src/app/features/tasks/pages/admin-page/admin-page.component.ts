import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { Task } from '../../models/task.model';
import { CreateTaskModalComponent } from '../../../../shared/components/modals/create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../../../../shared/components/modals/edit-task-modal/edit-task-modal.component';

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
export class AdminPageComponent {
  
  public tasks = signal<TaskExt[]>([
    {
      id: '1',
      title: 'Definir escopo do projeto',
      description: '',
      status: 'PENDING',
      priority: 'ALTA',
      deadline: '23/07/2026',
      assigneeInitials: 'AS',
      assigneeName: 'Ana Silva'
    },
    {
      id: '2',
      title: 'Design system inicial',
      description: '',
      status: 'IN_PROGRESS',
      priority: 'MEDIA',
      deadline: '27/07/2026',
      assigneeInitials: 'AS',
      assigneeName: 'Ana Silva'
    },
    {
      id: '3',
      title: 'Setup do repositório',
      description: '',
      status: 'COMPLETED',
      priority: 'BAIXA',
      deadline: '-',
      assigneeInitials: 'AM',
      assigneeName: 'Admin Master'
    },
    {
      id: '4',
      title: 'Migrar autenticação',
      description: '',
      status: 'PENDING',
      priority: 'ALTA',
      deadline: '18/07/2026',
      assigneeInitials: 'AM',
      assigneeName: 'Admin Master'
    },
    {
      id: '5',
      title: 'Kanban board',
      description: '',
      status: 'IN_PROGRESS',
      priority: 'MEDIA',
      deadline: '27/07/2026',
      assigneeInitials: 'AS',
      assigneeName: 'Ana Silva'
    }
  ]);

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
    let filtered = this.tasks();

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
}
