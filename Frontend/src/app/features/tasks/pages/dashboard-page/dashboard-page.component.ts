import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFacade } from '../../facades/tasks.facade';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { KanbanBoardComponent } from '../../components/kanban-board/kanban-board.component';
import { CreateTaskModalComponent } from '../../../../shared/components/modals/create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../../../../shared/components/modals/edit-task-modal/edit-task-modal.component';
import { Task, TaskStatus } from '../../models/task.model';
import { SkeletonModule } from 'primeng/skeleton';

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
    EditTaskModalComponent,
    SkeletonModule
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  public tasksFacade = inject(TasksFacade);

  pendingTasks = computed(() => this.tasksFacade.tasks().filter(t => t.status === 'PENDING'));
  inProgressTasks = computed(() => this.tasksFacade.tasks().filter(t => t.status === 'IN_PROGRESS'));
  completedTasks = computed(() => this.tasksFacade.tasks().filter(t => t.status === 'COMPLETED'));

  totalTasksCount = computed(() => this.tasksFacade.tasks().length);
  pendingTasksCount = computed(() => this.pendingTasks().length);
  inProgressTasksCount = computed(() => this.inProgressTasks().length);
  completedTasksCount = computed(() => this.completedTasks().length);
  overdueTasksCount = computed(() => {
    const now = new Date();
    return this.tasksFacade.tasks().filter(t => {
      if (!t.deadline || t.status === 'COMPLETED') return false;
      const d = new Date(t.deadline);
      return d < now;
    }).length;
  });

  ngOnInit() {
    this.tasksFacade.loadTasks();
  }

  onNewTask() {
    console.log('Nova tarefa clicada!');
  }

  onTaskMoved(event: { task: Task; newStatus: TaskStatus }) {
    this.tasksFacade.updateTask(event.task.id, { status: event.newStatus });
  }
}
