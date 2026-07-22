import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalFacade } from '../../../facades/modal.facade';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    ButtonModule
  ],
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss']
})
export class CreateTaskModalComponent {
  public facade = inject(ModalFacade);
  private fb = inject(FormBuilder);

  public taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    deadline: this.fb.control<Date | null>(null),
    priority: ['MEDIA', Validators.required],
    assignee: this.fb.control<string | null>(null)
  });

  public priorityOptions = [
    { label: 'Alta', value: 'ALTA' },
    { label: 'Média', value: 'MEDIA' },
    { label: 'Baixa', value: 'BAIXA' }
  ];

  public userOptions = [
    { label: 'Lucas (Admin)', value: '1' },
    { label: 'Maria (Dev)', value: '2' },
    { label: 'João (Design)', value: '3' }
  ];

  get isVisible(): boolean {
    return this.facade.isOpen();
  }

  set isVisible(val: boolean) {
    if (!val) {
      this.facade.closeModal();
      this.taskForm.reset({ priority: 'MEDIA' });
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const data = this.taskForm.getRawValue();
      
      // If the user is not admin, forcefully assign to self (mocked as user 1 for now)
      if (!this.facade.isAdmin()) {
        data.assignee = '1';
      }

      this.facade.createTask(data);
    }
  }
}
