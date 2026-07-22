import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async updateRole(id: string, role: import('@prisma/client').Role): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role }
    });
  }
}
