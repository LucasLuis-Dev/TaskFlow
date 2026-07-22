import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Task } from '@prisma/client';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({
      data,
      include: { attachments: true, user: true },
    });
  }

  async findAll(where?: Prisma.TaskWhereInput): Promise<Task[]> {
    return this.prisma.task.findMany({
      where,
      include: { attachments: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: { attachments: true, user: true },
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
      include: { attachments: true, user: true },
    });
  }

  async remove(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
