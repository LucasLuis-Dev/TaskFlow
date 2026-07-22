import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUserResult = {
    id: '1',
    name: 'Test',
    email: 'test@example.com',
    role: 'USER'
  };

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'mockToken' }),
    register: jest.fn().mockResolvedValue(mockUserResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register', async () => {
    const dto = { name: 'Test', email: 'test@example.com', password: 'pwd' };
    const result = await controller.register(dto);
    expect(result).toEqual(mockUserResult);
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should login', async () => {
    const req = { user: mockUserResult };
    const result = await controller.login(req);
    expect(result).toEqual({ access_token: 'mockToken' });
    expect(service.login).toHaveBeenCalledWith(req.user);
  });

  it('should get profile', () => {
    const req = { user: mockUserResult };
    const result = controller.getProfile(req);
    expect(result).toEqual(mockUserResult);
  });
});
