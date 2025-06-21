import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { PRODUCT_REPOSITORY_TOKEN } from '../../../domain/repositories/product.repository.interface';
import { Product } from '../../../domain/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../../../application/dtos/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: any;

  beforeEach(async () => {
    // Mock do repositório
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of product DTOs', async () => {
      const mockDate = new Date();
      const mockProducts = [
        {
          id: '1',
          name: 'Camiseta da Atlética',
          description: 'Camiseta oficial da atlética',
          price: 49.99,
          stock: 100,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '2',
          name: 'Caneca da Atlética',
          description: 'Caneca oficial da atlética',
          price: 29.99,
          stock: 50,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: '1',
          name: 'Camiseta da Atlética',
          description: 'Camiseta oficial da atlética',
          price: 49.99,
          stock: 100,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
        {
          id: '2',
          name: 'Caneca da Atlética',
          description: 'Caneca oficial da atlética',
          price: 29.99,
          stock: 50,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ]);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a product DTO when found', async () => {
      const mockDate = new Date();
      const mockProduct = {
        id: '1',
        name: 'Camiseta da Atlética',
        description: 'Camiseta oficial da atlética',
        price: 49.99,
        stock: 100,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.findById('1');

      expect(result).toEqual({
        id: '1',
        name: 'Camiseta da Atlética',
        description: 'Camiseta oficial da atlética',
        price: 49.99,
        stock: 100,
        createdAt: mockDate,
        updatedAt: mockDate,
      });
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('create', () => {
    it('should create a new product and return its DTO', async () => {
      const mockDate = new Date();
      const createProductDto: CreateProductDto = {
        name: 'Novo Produto',
        description: 'Descrição do novo produto',
        price: 39.99,
        stock: 75,
      };

      const createdProduct = {
        id: '123',
        ...createProductDto,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      mockRepository.create.mockResolvedValue(createdProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual({
        id: '123',
        name: 'Novo Produto',
        description: 'Descrição do novo produto',
        price: 39.99,
        stock: 75,
        createdAt: mockDate,
        updatedAt: mockDate,
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should update an existing product and return its DTO', async () => {
      const mockDate = new Date();
      const updateProductDto: UpdateProductDto = {
        name: 'Produto Atualizado',
        price: 59.99,
      };

      const updatedProduct = {
        id: '1',
        name: 'Produto Atualizado',
        description: 'Descrição original',
        price: 59.99,
        stock: 100,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      mockRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.update('1', updateProductDto);

      expect(result).toEqual({
        id: '1',
        name: 'Produto Atualizado',
        description: 'Descrição original',
        price: 59.99,
        stock: 100,
        createdAt: mockDate,
        updatedAt: mockDate,
      });
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateProductDto);
    });

    it('should throw NotFoundException when product to update is not found or update fails', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Produto Atualizado' })).rejects.toThrow(NotFoundException);
      expect(mockRepository.update).toHaveBeenCalledWith('999', { name: 'Produto Atualizado' });
    });
  });

  describe('delete', () => {
    it('should delete an existing product', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await service.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product to delete is not found or deletion fails', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.delete).toHaveBeenCalledWith('999');
    });
  });
});