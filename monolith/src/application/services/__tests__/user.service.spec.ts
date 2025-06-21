import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user.repository.interface';
import { ROLE_REPOSITORY_TOKEN } from '../../../domain/repositories/role.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;
  let mockRoleRepository: any;

  const mockRole = {
    id: 'role-1',
    name: 'student',
    description: 'Student role',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    registrationNumber: '123456',
    cpf: '123.456.789-00',
    phone: '999998888',
    role: mockRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    // Mock dos repositórios
    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      findByGoogleId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockRoleRepository = {
      findById: jest.fn(),
    };

    // Mock do bcrypt hash
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with password', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        registrationNumber: '123456',
        cpf: '123.456.789-00',
        phone: '999998888',
        roleId: 'role-1',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByCpf.mockResolvedValue(null);
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockUserRepository.create.mockResolvedValue({
        ...mockUser,
        password: 'hashedPassword',
      });

      const result = await service.create(createUserDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserRepository.findByCpf).toHaveBeenCalledWith('123.456.789-00');
      expect(mockRoleRepository.findById).toHaveBeenCalledWith('role-1');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        ...createUserDto,
        password: 'hashedPassword',
      }));
      expect(result).toEqual({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationNumber: '123456',
        cpf: '123.456.789-00',
        phone: '999998888',
        role: {
          id: 'role-1',
          name: 'student',
          description: 'Student role',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        googleId: undefined,
        profilePictureUrl: undefined,
        fcmToken: undefined,
      });
    });

    it('should create a new user with Google ID', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        googleId: 'google-123',
        registrationNumber: '123456',
        roleId: 'role-1',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByGoogleId.mockResolvedValue(null);
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockUserRepository.create.mockResolvedValue({
        ...mockUser,
        googleId: 'google-123',
        password: undefined,
      });

      const result = await service.create(createUserDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserRepository.findByGoogleId).toHaveBeenCalledWith('google-123');
      expect(mockRoleRepository.findById).toHaveBeenCalledWith('role-1');
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        ...createUserDto,
      }));
      expect(result).toEqual({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        registrationNumber: '123456',
        cpf: '123.456.789-00',
        phone: '999998888',
        role: {
          id: 'role-1',
          name: 'student',
          description: 'Student role',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        googleId: 'google-123',
        profilePictureUrl: undefined,
        fcmToken: undefined,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        roleId: 'role-1',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if CPF already exists', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'newjohn@example.com',
        password: 'password123',
        cpf: '123.456.789-00',
        roleId: 'role-1',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByCpf.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findByCpf).toHaveBeenCalledWith('123.456.789-00');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if no password and no googleId', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        roleId: 'role-1',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockRoleRepository.findById.mockResolvedValue(mockRole);

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if role does not exist', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        roleId: 'non-existent-role',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockRoleRepository.findById.mockResolvedValue(null);

      await expect(service.create(createUserDto)).rejects.toThrow(NotFoundException);
      expect(mockRoleRepository.findById).toHaveBeenCalledWith('non-existent-role');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of user DTOs', async () => {
      const mockUsers = [mockUser, { ...mockUser, id: 'user-2', email: 'jane@example.com' }];
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({ id: 'user-1', email: 'john@example.com' }));
      expect(result[1]).toEqual(expect.objectContaining({ id: 'user-2', email: 'jane@example.com' }));
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user DTO when found', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('user-1');

      expect(result).toEqual(expect.objectContaining({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      }));
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('findByEmail', () => {
    it('should return a user DTO when found by email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(result).toEqual(expect.objectContaining({
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      }));
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    });

    it('should return null when user is not found by email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto = {
        name: 'John Updated',
        phone: '888887777',
      };

      const updatedUser = { 
        ...mockUser, 
        name: 'John Updated',
        phone: '888887777',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update('user-1', updateUserDto);

      expect(result).toEqual(expect.objectContaining({
        id: 'user-1',
        name: 'John Updated',
        phone: '888887777',
      }));
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-1');
      expect(mockUserRepository.update).toHaveBeenCalledWith('user-1', updateUserDto);
    });

    it('should update user password with hashed password', async () => {
      const updateUserDto = {
        password: 'newPassword123',
      };

      const updatedUser = { ...mockUser, password: 'hashedPassword' };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      await service.update('user-1', updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(mockUserRepository.update).toHaveBeenCalledWith('user-1', {
        password: 'hashedPassword',
      });
    });

    it('should throw NotFoundException when user to update is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', { name: 'Updated' })).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when new email already exists', async () => {
      const existingUser = { 
        id: 'user-2', 
        name: 'Jane Doe', 
        email: 'jane@example.com' 
      };
      
      const updateUserDto = {
        email: 'jane@example.com',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.update('user-1', updateUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-1');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('jane@example.com');
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating with the same email', async () => {
      const updateUserDto = {
        name: 'John Updated',
        email: 'john@example.com',
      };

      const updatedUser = { 
        ...mockUser, 
        name: 'John Updated', 
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update('user-1', updateUserDto);

      expect(result).toEqual(expect.objectContaining({
        id: 'user-1',
        name: 'John Updated',
        email: 'john@example.com',
      }));
      expect(mockUserRepository.update).toHaveBeenCalledWith('user-1', updateUserDto);
    });
  });

  describe('delete', () => {
    it('should delete an existing user', async () => {
      mockUserRepository.delete.mockResolvedValue(true);

      await service.delete('user-1');

      expect(mockUserRepository.delete).toHaveBeenCalledWith('user-1');
    });

    it('should throw NotFoundException when user to delete is not found', async () => {
      mockUserRepository.delete.mockResolvedValue(false);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.delete).toHaveBeenCalledWith('non-existent');
    });
  });
});