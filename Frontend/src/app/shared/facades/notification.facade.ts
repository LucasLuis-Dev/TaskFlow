import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationFacade {
  private messageService = inject(MessageService);

  success(title: string, message: string) {
    this.messageService.add({ severity: 'success', summary: title, detail: message, life: 3000 });
  }

  error(title: string, message: string) {
    this.messageService.add({ severity: 'error', summary: title, detail: message, life: 4000 });
  }

  info(title: string, message: string) {
    this.messageService.add({ severity: 'info', summary: title, detail: message, life: 3000 });
  }

  warn(title: string, message: string) {
    this.messageService.add({ severity: 'warn', summary: title, detail: message, life: 3000 });
  }
}
