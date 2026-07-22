import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto, userId: string, userRole: Role) {
    const { attachments, assignee, ...taskData } = createTaskDto;
    
    const targetUserId = (userRole === Role.ADMIN && assignee) ? assignee : userId;

    return this.repository.create({
      ...taskData,
      deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
      user: { connect: { id: targetUserId } },
      attachments: attachments ? {
        create: attachments
      } : undefined
    });
  }

  async findAll(userRole: Role, userId: string) {
    if (userRole === Role.ADMIN) {
      return this.repository.findAll();
    }
    return this.repository.findAll({ userId });
  }

  async findOne(id: string, userRole: Role, userId: string) {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }
    if (userRole !== Role.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar esta task');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userRole: Role, userId: string) {
    await this.findOne(id, userRole, userId);

    const { attachments, assignee, ...taskData } = updateTaskDto;
    
    const attachmentsUpdate = attachments ? {
      deleteMany: {},
      create: attachments
    } : undefined;

    return this.repository.update(id, {
      ...taskData,
      deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
      user: (userRole === Role.ADMIN && assignee) ? { connect: { id: assignee } } : undefined,
      attachments: attachmentsUpdate
    });
  }

  async remove(id: string, userRole: Role, userId: string) {
    await this.findOne(id, userRole, userId);
    return this.repository.remove(id);
  }
}
