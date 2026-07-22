import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalFacade } from '../../../facades/modal.facade';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-edit-task-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    FileUploadModule
  ],
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent {
  public facade = inject(ModalFacade);
  private fb = inject(FormBuilder);

  public editForm = this.fb.group({
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

  constructor() {
    effect(() => {
      const task = this.facade.editingTask();
      if (task) {
        let parsedDate = null;
        if (task.deadline) {
          const parts = task.deadline.split('/');
          if (parts.length === 3) {
            parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00`);
          }
        }
        // Parse data from task
        this.editForm.patchValue({
          title: task.title,
          description: task.description,
          deadline: parsedDate,
          priority: task.priority,
          assignee: task.assignee || '1'
        });
      }
    });
  }

  get isVisible(): boolean {
    return this.facade.isEditOpen();
  }

  set isVisible(val: boolean) {
    if (!val) {
      this.facade.closeEditModal();
      this.editForm.reset({ priority: 'MEDIA' });
    }
  }

  onDelete() {
    const task = this.facade.editingTask();
    if (task) {
      this.facade.deleteTask(task.id);
    }
  }

  onUpload(event: any) {
    // Mock upload handler
    console.log('Arquivos:', event.files);
  }

  onSubmit() {
    if (this.editForm.valid) {
      const data = this.editForm.getRawValue();
      const task = this.facade.editingTask();
      
      if (!this.facade.isAdmin()) {
        data.assignee = '1';
      }

      this.facade.updateTask(task.id, data);
    }
  }
}
