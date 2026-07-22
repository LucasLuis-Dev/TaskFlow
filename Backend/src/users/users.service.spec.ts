import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: Role.USER,
  };

  const mockUsersRepository = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findByEmail: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    updateRole: jest.fn().mockResolvedValue({ ...mockUser, role: Role.ADMIN }),
    count: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should findAll users', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockUser]);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should findByEmail', async () => {
    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual(mockUser);
    expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should findById', async () => {
    const result = await service.findById('1');
    expect(result).toEqual(mockUser);
    expect(repository.findById).toHaveBeenCalledWith('1');
  });

  it('should create a user', async () => {
    const dto = { name: 'Test User', email: 'test@example.com', password: 'pwd', role: Role.USER };
    const result = await service.create(dto);
    expect(result).toEqual(mockUser);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('should update role', async () => {
    const result = await service.updateRole('1', Role.ADMIN);
    expect(result.role).toBe(Role.ADMIN);
    expect(repository.updateRole).toHaveBeenCalledWith('1', Role.ADMIN);
  });

  it('should count users', async () => {
    const result = await service.count();
    expect(result).toBe(1);
    expect(repository.count).toHaveBeenCalled();
  });
});
