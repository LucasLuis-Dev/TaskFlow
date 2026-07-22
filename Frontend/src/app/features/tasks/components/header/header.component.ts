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
  private authFacade = inject(AuthFacade);

  @Output() newTask = new EventEmitter<void>();

  openCreateTaskModal() {
    this.modalFacade.openModal();
  }

  logout() {
    this.authFacade.logout();
  }
}
