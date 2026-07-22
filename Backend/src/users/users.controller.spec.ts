import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: Role.USER,
  };

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    updateRole: jest.fn().mockResolvedValue({ ...mockUser, role: Role.ADMIN }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should findAll users and exclude passwords', async () => {
    const result = await controller.findAll();
    expect(result.length).toBe(1);
    expect(result[0]).not.toHaveProperty('password');
    expect(result[0].email).toBe('test@example.com');
  });

  it('should update user role and exclude password', async () => {
    const result = await controller.updateRole('1', Role.ADMIN);
    expect(result).not.toHaveProperty('password');
    expect(result.role).toBe(Role.ADMIN);
    expect(service.updateRole).toHaveBeenCalledWith('1', Role.ADMIN);
  });
});
