import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { CreateTaskModalComponent } from '../../../../shared/components/modals/create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../../../../shared/components/modals/edit-task-modal/edit-task-modal.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-my-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    TaskCardComponent,
    CreateTaskModalComponent,
    EditTaskModalComponent
  ],
  templateUrl: './my-tasks-page.component.html',
  styleUrls: ['./my-tasks-page.component.scss']
})
export class MyTasksPageComponent {
  myTasks = signal<Task[]>([
    {
      id: '1',
      title: 'Definir escopo do projeto',
      description: 'Levantar requisitos iniciais junto ao time.',
      status: 'PENDING',
      priority: 'ALTA',
      deadline: '23/07/2026',
      assigneeInitials: 'AM'
    },
    {
      id: '2',
      title: 'Migrar autenticação',
      description: 'JWT + refresh token no backend NestJS.',
      status: 'IN_PROGRESS',
      priority: 'ALTA',
      deadline: '18/07/2026',
      assigneeInitials: 'AM'
    },
    {
      id: '5',
      title: 'Setup do repositório',
      description: 'Configurar CI, lint e prettier.',
      status: 'COMPLETED',
      priority: 'BAIXA',
      assigneeInitials: 'AM'
    }
  ]);
}
