import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Role, TaskStatus, TaskPriority } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: TasksRepository;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIA,
    userId: 'user1',
  };

  const mockTasksRepository = {
    create: jest.fn().mockResolvedValue(mockTask),
    findAll: jest.fn().mockResolvedValue([mockTask]),
    findById: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue({ ...mockTask, title: 'Updated' }),
    remove: jest.fn().mockResolvedValue(mockTask),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: mockTasksRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<TasksRepository>(TasksRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks for ADMIN', async () => {
      const result = await service.findAll(Role.ADMIN, 'adminId');
      expect(result).toEqual([mockTask]);
      expect(repository.findAll).toHaveBeenCalledWith(); // no where clause
    });

    it('should return filtered tasks for USER', async () => {
      const result = await service.findAll(Role.USER, 'user1');
      expect(result).toEqual([mockTask]);
      expect(repository.findAll).toHaveBeenCalledWith({ userId: 'user1' });
    });
  });

  describe('findOne', () => {
    it('should return task if ADMIN', async () => {
      const result = await service.findOne('1', Role.ADMIN, 'adminId');
      expect(result).toEqual(mockTask);
    });

    it('should return task if USER and owner', async () => {
      const result = await service.findOne('1', Role.USER, 'user1');
      expect(result).toEqual(mockTask);
    });

    it('should throw ForbiddenException if USER and not owner', async () => {
      await expect(service.findOne('1', Role.USER, 'otherUser')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      mockTasksRepository.findById.mockResolvedValueOnce(null);
      await expect(service.findOne('999', Role.ADMIN, 'adminId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create task assigned to self if USER', async () => {
      const dto = { title: 'Test', priority: TaskPriority.MEDIA, status: TaskStatus.PENDING };
      await service.create(dto, 'user1', Role.USER);
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
        user: { connect: { id: 'user1' } }
      }));
    });

    it('should create task assigned to specified assignee if ADMIN', async () => {
      const dto = { title: 'Test', priority: TaskPriority.MEDIA, status: TaskStatus.PENDING, assignee: 'user2' };
      await service.create(dto, 'adminId', Role.ADMIN);
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
        user: { connect: { id: 'user2' } }
      }));
    });
  });

  describe('update', () => {
    it('should update task', async () => {
      const dto = { title: 'Updated' };
      const result = await service.update('1', dto, Role.ADMIN, 'adminId');
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove task', async () => {
      const result = await service.remove('1', Role.ADMIN, 'adminId');
      expect(result).toEqual(mockTask);
      expect(repository.remove).toHaveBeenCalledWith('1');
    });
  });
});
