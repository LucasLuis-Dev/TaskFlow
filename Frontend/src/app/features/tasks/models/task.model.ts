export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'ALTA' | 'MEDIA' | 'BAIXA';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string;
  assigneeInitials?: string;
  attachmentsCount?: number;
  attachments?: { fileUrl: string, fileName: string, fileType: string }[];
}
