import { Component, inject, effect, ViewChild, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalFacade } from '../../../facades/modal.facade';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';

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

  @ViewChild(FileUpload) fileUpload!: FileUpload;


  constructor() {
    effect(() => {
      const task = this.facade.editingTask();
      const isAdmin = this.facade.isAdmin();
      const users = this.facade.users();

      if (task) {
        if (isAdmin && users.length === 0) {
          // Aguarda os usuários carregarem para que o PrimeNG não trave o p-select vazio
          return;
        }

        untracked(() => {
          let parsedDate = null;
          if (task.deadline) {
            // Parse directly from ISO string
            parsedDate = new Date(task.deadline);
          }
          // Parse data from task
          this.editForm.patchValue({
            title: task.title,
            description: task.description,
            deadline: parsedDate,
            priority: task.priority,
            assignee: task.userId || null
          });
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
      if (this.fileUpload) {
        this.fileUpload.clear();
      }
    }
  }

  onDelete() {
    const task = this.facade.editingTask();
    if (task) {
      this.facade.deleteTask(task.id);
    }
  }

  onUpload(event: any) {
    // We now use ViewChild to get files in onSubmit, but we keep this method bound if needed
  }

  onSubmit() {
    if (this.editForm.valid) {
      const data = this.editForm.getRawValue();
      const task = this.facade.editingTask();
      
      if (!this.facade.isAdmin()) {
        delete (data as any).assignee;
      }

      if (this.fileUpload && this.fileUpload.files.length > 0) {
        const filesToUpload = [...this.fileUpload.files];
        this.facade.uploadAndSaveTask(task.id, data, filesToUpload);
        this.fileUpload.clear();
      } else {
        this.facade.updateTask(task.id, data);
      }
    }
  }

  downloadFile(url: string, fileName: string, event: Event) {
    event.preventDefault();
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(err => {
        console.error('Erro ao baixar arquivo', err);
        // Fallback: just open in new tab
        window.open(url, '_blank');
      });
  }
}
