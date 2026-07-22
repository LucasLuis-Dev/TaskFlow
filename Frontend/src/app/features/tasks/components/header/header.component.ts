import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { ModalFacade } from '../../../../shared/facades/modal.facade';
import { AuthFacade } from '../../../auth/facades/auth.facade';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, PopoverModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private modalFacade = inject(ModalFacade);
  public authFacade = inject(AuthFacade);

  get userInitials() {
    const name = this.authFacade.userName() || '';
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  @Output() newTask = new EventEmitter<void>();

  openCreateTaskModal() {
    this.modalFacade.openModal();
  }

  logout() {
    this.authFacade.logout();
  }
}
