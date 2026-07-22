import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.repository.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findAll(): Promise<User[]> {
    return this.repository.findAll();
  }
}
