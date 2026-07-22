import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { ModalFacade } from '../../../../shared/facades/modal.facade';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  private modalFacade = inject(ModalFacade);

  openEdit() {
    this.modalFacade.openEditModal(this.task);
  }
}
