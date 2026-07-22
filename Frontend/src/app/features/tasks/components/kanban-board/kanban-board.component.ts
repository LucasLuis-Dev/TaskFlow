import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DragDropModule, 
    SelectModule, 
    InputTextModule, 
    TaskCardComponent
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent {
  @Input() pendingTasks: Task[] = [];
  @Input() inProgressTasks: Task[] = [];
  @Input() completedTasks: Task[] = [];

  @Output() taskStatusChanged = new EventEmitter<{task: Task, newStatus: TaskStatus}>();

  searchQuery = '';
  selectedPriority: string | null = null;
  selectedDeadline: string | null = null;

  priorityOptions = [
    { label: 'Todas prioridades', value: null },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Média', value: 'MEDIA' },
    { label: 'Baixa', value: 'BAIXA' }
  ];

  deadlineOptions = [
    { label: 'Todos prazos', value: null },
    { label: 'Atrasadas', value: 'OVERDUE' },
    { label: 'Próximos 7 dias', value: 'NEXT_7_DAYS' },
    { label: 'Com prazo', value: 'HAS_DEADLINE' }
  ];

  get filteredPendingTasks() {
    return this.applyFilters(this.pendingTasks);
  }

  get filteredInProgressTasks() {
    return this.applyFilters(this.inProgressTasks);
  }

  get filteredCompletedTasks() {
    return this.applyFilters(this.completedTasks);
  }

  applyFilters(tasks: Task[]): Task[] {
    let filtered = tasks;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (this.selectedPriority) {
      filtered = filtered.filter(t => t.priority === this.selectedPriority);
    }

    if (this.selectedDeadline) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      filtered = filtered.filter(t => {
        if (!t.deadline) return false;
        
        const deadlineDate = new Date(t.deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (this.selectedDeadline === 'OVERDUE') {
          return diffDays < 0 && t.status !== 'COMPLETED';
        } else if (this.selectedDeadline === 'NEXT_7_DAYS') {
          return diffDays >= 0 && diffDays <= 7;
        } else if (this.selectedDeadline === 'HAS_DEADLINE') {
          return true;
        }
        return true;
      });
    }

    return filtered;
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      
      const movedTask = event.container.data[event.currentIndex];
      this.taskStatusChanged.emit({ task: movedTask, newStatus });
    }
  }
}
