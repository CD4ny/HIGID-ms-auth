import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';

// @ts-ignore
import * as faker from 'faker';

export function generateFakeUser(): RegisterDto {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
    token: faker.phone.p,
    password: faker.address.streetAddress(),
  };
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            // Mock the PrismaService methods you need for testing
            createUser: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const fakeUser = generateFakeUser();
    expect(await authService.register(fakeUser)).toBeInstanceOf(RegisterDto);
  });
});
