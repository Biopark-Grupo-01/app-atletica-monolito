import { Test, TestingModule } from '@nestjs/testing';
import { TrainingController } from '../training.controller';
import { TrainingService } from '../../../application/services/training.service';
import { HateoasService } from '../../../application/services/hateoas.service';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
} from '../../../application/dtos/training.dto';
import { Training } from '../../../domain/entities/training.entity';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

// Mock para Express Response
class MockResponse {
  statusCode: number;
  body: any;

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(data: any) {
    this.body = data;
    return this;
  }
}

describe('TrainingController', () => {
  let controller: TrainingController;
  let trainingService: TrainingService;
  let hateoasService: HateoasService;

  beforeEach(async () => {
    // Mock dos serviços
    const mockTrainingService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockHateoasService = {
      addLinksToCollection: jest.fn((items) => items),
      createLinksForCollection: jest.fn(() => []),
      addLinksToItem: jest.fn((item) => item),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingController],
      providers: [
        {
          provide: TrainingService,
          useValue: mockTrainingService,
        },
        {
          provide: HateoasService,
          useValue: mockHateoasService,
        },
      ],
    }).compile();

    controller = module.get<TrainingController>(TrainingController);
    trainingService = module.get<TrainingService>(TrainingService);
    hateoasService = module.get<HateoasService>(HateoasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all trainings with links', async () => {
      // Arrange
      const mockTrainings = [
        new Training({
          id: '1',
          title: 'Treino 1',
          description: 'Descrição do treino 1',
          place: 'Local 1',
          start_date: '2025-06-20',
          start_time: '18:00',
          coach: 'Coach 1',
          responsible: 'Responsável 1',
        }),
        new Training({
          id: '2',
          title: 'Treino 2',
          description: 'Descrição do treino 2',
          place: 'Local 2',
          start_date: '2025-06-21',
          start_time: '19:00',
          coach: 'Coach 2',
          responsible: 'Responsável 2',
        }),
      ];

      const mockRes = new MockResponse() as unknown as Response;

      jest.spyOn(trainingService, 'findAll').mockResolvedValue(mockTrainings);
      jest
        .spyOn(hateoasService, 'addLinksToCollection')
        .mockReturnValue(mockTrainings);
      jest
        .spyOn(hateoasService, 'createLinksForCollection')
        .mockReturnValue([]);

      // Act
      await controller.findAll(mockRes);

      // Assert
      expect(trainingService.findAll).toHaveBeenCalled();
      expect(hateoasService.addLinksToCollection).toHaveBeenCalled();
      expect(hateoasService.createLinksForCollection).toHaveBeenCalledWith(
        'trainings',
      );
      expect(mockRes.statusCode).toBe(HttpStatus.OK);
      expect(mockRes.body.data).toEqual(mockTrainings);
      expect(mockRes.body.statusCode).toBe(HttpStatus.OK);
    });

    it('should handle errors when getting trainings', async () => {
      // Arrange
      const mockRes = new MockResponse() as unknown as Response;
      const error = new Error('Database error');

      jest.spyOn(trainingService, 'findAll').mockRejectedValue(error);

      // Act
      await controller.findAll(mockRes);

      // Assert
      expect(trainingService.findAll).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.body.message).toBe(
        'An unexpected error occurred while retrieving trainings',
      );
    });
  });

  describe('findById', () => {
    it('should return a training by id with links', async () => {
      // Arrange
      const mockTraining = new Training({
        id: '1',
        title: 'Treino 1',
        description: 'Descrição do treino 1',
        place: 'Local 1',
        start_date: '2025-06-20',
        start_time: '18:00',
        coach: 'Coach 1',
        responsible: 'Responsável 1',
      });

      const mockRes = new MockResponse() as unknown as Response;

      jest.spyOn(trainingService, 'findById').mockResolvedValue(mockTraining);
      jest
        .spyOn(hateoasService, 'addLinksToItem')
        .mockReturnValue(mockTraining);

      // Act
      await controller.findById('1', mockRes);

      // Assert
      expect(trainingService.findById).toHaveBeenCalledWith('1');
      expect(hateoasService.addLinksToItem).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(HttpStatus.OK);
      expect(mockRes.body.data).toEqual(mockTraining);
    });

    it('should return 404 when training not found', async () => {
      // Arrange
      const mockRes = new MockResponse() as unknown as Response;

      jest
        .spyOn(trainingService, 'findById')
        .mockRejectedValue(new NotFoundException('Training not found'));

      // Act
      await controller.findById('999', mockRes);

      // Assert
      expect(trainingService.findById).toHaveBeenCalledWith('999');
      expect(mockRes.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(mockRes.body.message).toBe('Training not found');
    });
  });

  describe('create', () => {
    it('should create a new training and return it with links', async () => {
      // Arrange
      const createDto: CreateTrainingDto = {
        title: 'Novo Treino',
        description: 'Descrição do novo treino',
        place: 'Novo Local',
        start_date: '2025-06-22',
        start_time: '20:00',
        coach: 'Novo Coach',
        responsible: 'Novo Responsável',
        modality: 'Futsal',
      };

      const mockTraining = new Training({
        id: 'new-id',
        title: 'Novo Treino',
        description: 'Descrição do novo treino',
        place: 'Novo Local',
        start_date: '2025-06-22',
        start_time: '20:00',
        coach: 'Novo Coach',
        responsible: 'Novo Responsável',
      });

      const mockRes = new MockResponse() as unknown as Response;

      jest.spyOn(trainingService, 'create').mockResolvedValue(mockTraining);
      jest
        .spyOn(hateoasService, 'addLinksToItem')
        .mockReturnValue(mockTraining);

      // Act
      await controller.create(createDto, mockRes);

      // Assert
      expect(trainingService.create).toHaveBeenCalledWith(createDto);
      expect(hateoasService.addLinksToItem).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(HttpStatus.CREATED);
      expect(mockRes.body.data).toEqual(mockTraining);
    });

    it('should return 400 when creation fails', async () => {
      // Arrange
      const createDto: CreateTrainingDto = {
        title: 'Novo Treino',
        description: 'Descrição do novo treino',
        place: 'Novo Local',
        start_date: '2025-06-22',
        start_time: '20:00',
        coach: 'Novo Coach',
        responsible: 'Novo Responsável',
        modality: 'Futsal',
      };

      const mockRes = new MockResponse() as unknown as Response;
      const error = new Error('Invalid data');

      jest.spyOn(trainingService, 'create').mockRejectedValue(error);

      // Act
      await controller.create(createDto, mockRes);

      // Assert
      expect(trainingService.create).toHaveBeenCalledWith(createDto);
      expect(mockRes.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(mockRes.body.message).toBe('Invalid data');
    });
  });

  describe('update', () => {
    it('should update a training and return it with links', async () => {
      // Arrange
      const updateDto: UpdateTrainingDto = {
        title: 'Treino Atualizado',
      };

      const mockTraining = new Training({
        id: '1',
        title: 'Treino Atualizado',
        description: 'Descrição do treino',
        place: 'Local 1',
        start_date: '2025-06-20',
        start_time: '18:00',
        coach: 'Coach 1',
        responsible: 'Responsável 1',
      });

      const mockRes = new MockResponse() as unknown as Response;

      jest.spyOn(trainingService, 'update').mockResolvedValue(mockTraining);
      jest
        .spyOn(hateoasService, 'addLinksToItem')
        .mockReturnValue(mockTraining);

      // Act
      await controller.update('1', updateDto, mockRes);

      // Assert
      expect(trainingService.update).toHaveBeenCalledWith('1', updateDto);
      expect(hateoasService.addLinksToItem).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(HttpStatus.OK);
      expect(mockRes.body.data).toEqual(mockTraining);
    });

    it('should return 404 when training to update not found', async () => {
      // Arrange
      const updateDto: UpdateTrainingDto = {
        title: 'Treino Atualizado',
      };

      const mockRes = new MockResponse() as unknown as Response;

      jest
        .spyOn(trainingService, 'update')
        .mockRejectedValue(new NotFoundException('Training not found'));

      // Act
      await controller.update('999', updateDto, mockRes);

      // Assert
      expect(trainingService.update).toHaveBeenCalledWith('999', updateDto);
      expect(mockRes.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(mockRes.body.message).toBe('Training not found');
    });
  });

  describe('delete', () => {
    it('should delete a training and return success message', async () => {
      // Arrange
      const mockRes = new MockResponse() as unknown as Response;

      jest.spyOn(trainingService, 'delete').mockResolvedValue(undefined);

      // Act
      await controller.delete('1', mockRes);

      // Assert
      expect(trainingService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.statusCode).toBe(HttpStatus.OK);
      expect(mockRes.body.data).toEqual({
        id: '1',
        message: 'Training deleted successfully',
      });
    });

    it('should return 404 when training to delete not found', async () => {
      // Arrange
      const mockRes = new MockResponse() as unknown as Response;

      jest
        .spyOn(trainingService, 'delete')
        .mockRejectedValue(new NotFoundException('Training not found'));

      // Act
      await controller.delete('999', mockRes);

      // Assert
      expect(trainingService.delete).toHaveBeenCalledWith('999');
      expect(mockRes.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(mockRes.body.message).toBe('Training not found');
    });
  });
});
