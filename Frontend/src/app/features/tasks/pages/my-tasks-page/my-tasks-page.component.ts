import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFacade } from '../../facades/tasks.facade';
import { AuthFacade } from '../../../auth/facades/auth.facade';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { CreateTaskModalComponent } from '../../../../shared/components/modals/create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../../../../shared/components/modals/edit-task-modal/edit-task-modal.component';
import { Task } from '../../models/task.model';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-my-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    TaskCardComponent,
    CreateTaskModalComponent,
    EditTaskModalComponent,
    SkeletonModule
  ],
  templateUrl: './my-tasks-page.component.html',
  styleUrls: ['./my-tasks-page.component.scss']
})
export class MyTasksPageComponent implements OnInit {
  public tasksFacade = inject(TasksFacade);
  public authFacade = inject(AuthFacade);

  myTasks = computed(() => {
    const userId = this.authFacade.userId();
    return this.tasksFacade.tasks().filter(t => t.userId === userId);
  });

  ngOnInit() {
    this.tasksFacade.loadTasks();
  }
}
