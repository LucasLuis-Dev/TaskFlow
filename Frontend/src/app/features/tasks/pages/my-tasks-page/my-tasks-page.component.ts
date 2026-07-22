import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFacade } from '../../facades/tasks.facade';
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
export class MyTasksPageComponent implements OnInit {
  private tasksFacade = inject(TasksFacade);

  myTasks = computed(() => this.tasksFacade.tasks());

  ngOnInit() {
    this.tasksFacade.loadTasks();
  }
}
