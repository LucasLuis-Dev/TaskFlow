import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { KanbanBoardComponent } from '../../components/kanban-board/kanban-board.component';
import { CreateTaskModalComponent } from '../../../../shared/components/modals/create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../../../../shared/components/modals/edit-task-modal/edit-task-modal.component';
import { Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    MetricCardComponent,
    KanbanBoardComponent,
    CreateTaskModalComponent,
    EditTaskModalComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent {
  // Dummy data for visual presentation
  pendingTasks = signal<Task[]>([
    {
      id: '1',
      title: 'Definir escopo do projeto',
      description: 'Levantar requisitos iniciais junto ao time.',
      status: 'PENDING',
      priority: 'ALTA',
      deadline: '23/07/2026',
      assigneeInitials: 'AS'
    },
    {
      id: '2',
      title: 'Migrar autenticação',
      description: 'JWT + refresh token no backend NestJS.',
      status: 'PENDING',
      priority: 'ALTA',
      deadline: '18/07/2026',
      assigneeInitials: 'AM'
    }
  ]);

  inProgressTasks = signal<Task[]>([
    {
      id: '3',
      title: 'Design system inicial',
      description: 'Cores, tipografia e componentes base no Figma.',
      status: 'IN_PROGRESS',
      priority: 'MEDIA',
      deadline: '27/07/2026',
      attachmentsCount: 1,
      assigneeInitials: 'AS'
    },
    {
      id: '4',
      title: 'Kanban board',
      description: 'Drag-and-drop entre colunas.',
      status: 'IN_PROGRESS',
      priority: 'MEDIA',
      deadline: '27/07/2026',
      assigneeInitials: 'AS'
    }
  ]);

  completedTasks = signal<Task[]>([
    {
      id: '5',
      title: 'Setup do repositório',
      description: 'Configurar CI, lint e prettier.',
      status: 'COMPLETED',
      priority: 'BAIXA',
      assigneeInitials: 'AM'
    }
  ]);

  onNewTask() {
    console.log('Nova tarefa clicada!');
  }

  onTaskMoved(event: { task: Task; newStatus: TaskStatus }) {
    console.log('Task moved:', event.task.title, 'to', event.newStatus);
    // Here we would typically dispatch an action to a Facade/Store
  }
}
