import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Role, TaskStatus, TaskPriority } from '@prisma/client';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIA,
    userId: 'user1',
  };

  const mockTasksService = {
    create: jest.fn().mockResolvedValue(mockTask),
    findAll: jest.fn().mockResolvedValue([mockTask]),
    findOne: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue({ ...mockTask, title: 'Updated' }),
    remove: jest.fn().mockResolvedValue(mockTask),
  };

  const mockRequest = {
    user: { id: 'user1', role: Role.USER }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const dto = { title: 'Test Task', priority: TaskPriority.MEDIA, status: TaskStatus.PENDING };
    const result = await controller.create(dto, mockRequest);
    expect(result).toEqual(mockTask);
    expect(service.create).toHaveBeenCalledWith(dto, 'user1', Role.USER);
  });

  it('should get all tasks', async () => {
    const result = await controller.findAll(mockRequest);
    expect(result).toEqual([mockTask]);
    expect(service.findAll).toHaveBeenCalledWith(Role.USER, 'user1');
  });

  it('should get one task', async () => {
    const result = await controller.findOne('1', mockRequest);
    expect(result).toEqual(mockTask);
    expect(service.findOne).toHaveBeenCalledWith('1', Role.USER, 'user1');
  });

  it('should update a task', async () => {
    const dto = { title: 'Updated' };
    const result = await controller.update('1', dto, mockRequest);
    expect(result.title).toBe('Updated');
    expect(service.update).toHaveBeenCalledWith('1', dto, Role.USER, 'user1');
  });

  it('should remove a task', async () => {
    const result = await controller.remove('1', mockRequest);
    expect(result).toEqual(mockTask);
    expect(service.remove).toHaveBeenCalledWith('1', Role.USER, 'user1');
  });
});
