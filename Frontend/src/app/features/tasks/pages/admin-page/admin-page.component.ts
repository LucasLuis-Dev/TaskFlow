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
}
