import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Task } from '../../models/task.model';
import { CreateTaskModalComponent } from '../../../../shared/components/modals/create-task-modal/create-task-modal.component';
import { EditTaskModalComponent } from '../../../../shared/components/modals/edit-task-modal/edit-task-modal.component';
import { ButtonModule } from 'primeng/button';
import { ModalFacade } from '../../../../shared/facades/modal.facade';
import { TasksFacade } from '../../facades/tasks.facade';
import { SkeletonModule } from 'primeng/skeleton';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    HeaderComponent, 
    ButtonModule,
    CreateTaskModalComponent,
    EditTaskModalComponent,
    SkeletonModule
  ],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit {
  public currentDate = signal<Date>(new Date());
  public calendarDays = signal<CalendarDay[]>([]);
  public weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  public tasksFacade = inject(TasksFacade);
  private modalFacade = inject(ModalFacade);

  constructor() {
    effect(() => {
      // Regenerate calendar when tasks change
      this.tasksFacade.tasks();
      this.generateCalendar();
    });
  }

  ngOnInit() {
    this.tasksFacade.loadTasks();
    this.generateCalendar();
  }

  get currentMonthName(): string {
    const month = this.currentDate().toLocaleString('pt-BR', { month: 'long' });
    const year = this.currentDate().getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} De ${year}`;
  }

  generateCalendar() {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];
    const today = new Date();

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.createCalendarDay(dayDate, false, today));
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push(this.createCalendarDay(dayDate, true, today));
    }

    // Next month filler days (to complete 42 cells / 6 weeks)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const dayDate = new Date(year, month + 1, i);
      days.push(this.createCalendarDay(dayDate, false, today));
    }

    this.calendarDays.set(days);
  }

  private createCalendarDay(date: Date, isCurrentMonth: boolean, today: Date): CalendarDay {
    const dayTasks = this.tasksFacade.tasks().filter(t => {
      if (!t.deadline) return false;
      // Parse ISO string to local Date and compare
      const tDate = new Date(t.deadline);
      // Because ISO string parse can be tricky with timezones if it's midnight UTC,
      // it's best to match the exact calendar year, month, date.
      // But we have to make sure if backend sent '2026-07-25T00:00:00.000Z' 
      // tDate.getDate() could be 24 or 25 depending on timezone.
      // Assuming UTC dates representing midnight, getting the UTC values might be safer, 
      // but if the app relies on local time, we use local time methods.
      // Let's use local timezone methods like the rest of the app.
      return tDate.getFullYear() === date.getFullYear() &&
             tDate.getMonth() === date.getMonth() &&
             tDate.getDate() === date.getDate();
    });
    
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();

    return {
      date,
      isCurrentMonth,
      isToday,
      tasks: dayTasks
    };
  }

  // Function kept for potential future use or can be removed if unused.
  private formatDateStr(date: Date): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  previousMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    this.generateCalendar();
  }

  nextMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    this.generateCalendar();
  }

  goToToday() {
    this.currentDate.set(new Date());
    this.generateCalendar();
  }

  openTask(task: Task, event: Event) {
    event.stopPropagation();
    this.modalFacade.openEditModal(task);
  }

  getTaskColorClass(task: Task): string {
    if (task.priority === 'ALTA') return 'bg-blue';
    if (task.priority === 'MEDIA') return 'bg-yellow';
    return 'bg-gray'; // Default
  }
}
