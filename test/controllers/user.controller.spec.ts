import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/presentation/controllers/user.controller';
import { UserService } from '../../src/application/services/user.service';
import { CreateUserDto } from '../../src/application/dtos/create-user.dto';
import { NotFoundException } from '@nestjs/common';

// Mock do UserService
const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        registrationNumber: '123456',
        cpf: '123.456.789-00',
        email: 'test@test.com',
        password: 'password123',
        phone: '(11) 99999-9999',
        cargoId: 'cargo-id-123',
      };

      const expectedResult = {
        id: 'user-id-123',
        name: 'Test User',
        registrationNumber: '123456',
        cpf: '123.456.789-00',
        email: 'test@test.com',
        phone: '(11) 99999-9999',
        cargo: {
          id: 'cargo-id-123',
          nome: 'Test Cargo',
          descricao: 'Test Description',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      const expectedResult = [
        {
          id: 'user-id-123',
          name: 'Test User',
          registrationNumber: '123456',
          cpf: '123.456.789-00',
          email: 'test@test.com',
          phone: '(11) 99999-9999',
          cargo: {
            id: 'cargo-id-123',
            nome: 'Test Cargo',
            descricao: 'Test Description',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserService.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // Arrange
      const userId = 'user-id-123';
      const expectedResult = {
        id: userId,
        name: 'Test User',
        registrationNumber: '123456',
        cpf: '123.456.789-00',
        email: 'test@test.com',
        phone: '(11) 99999-9999',
        cargo: {
          id: 'cargo-id-123',
          nome: 'Test Cargo',
          descricao: 'Test Description',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.findOne.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findOne(userId);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw a NotFoundException if user not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      mockUserService.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });

  // Testes adicionais para update e delete podem ser implementados de forma similar
});
