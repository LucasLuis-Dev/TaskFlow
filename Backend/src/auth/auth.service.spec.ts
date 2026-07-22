import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUser = {
    id: '1',
    name: 'User',
    email: 'test@example.com',
    password: 'hashed_password',
    role: Role.USER
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    count: jest.fn().mockResolvedValue(1),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      await expect(service.register({ name: 'test', email: 'test@example.com', password: 'pwd' }))
        .rejects.toThrow(ConflictException);
    });

    it('should register a new user and exclude password', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      mockUsersService.create.mockResolvedValueOnce(mockUser);
      
      const result = await service.register({ name: 'User', email: 'new@example.com', password: 'pwd' });
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
      expect(mockUsersService.create).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser('test@example.com', 'pwd');
      expect(result).not.toHaveProperty('password');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null if invalid password', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.validateUser('test@example.com', 'wrongpwd');
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce(null);
      const result = await service.validateUser('nonexistent@example.com', 'pwd');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token', async () => {
      const result = await service.login(mockUser);
      expect(result).toHaveProperty('access_token', 'mockToken');
    });
  });
});
