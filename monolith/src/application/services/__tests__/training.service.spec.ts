import { Test, TestingModule } from '@nestjs/testing';
import { TrainingService } from '../training.service';
import { TRAINING_REPOSITORY_TOKEN } from '../../../domain/repositories/training.repository.interface';
import { Training } from '../../../domain/entities/training.entity';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('TrainingService', () => {
  let service: TrainingService;
  let mockRepository: any;
  const mockUuid = 'test-uuid-1234';

  beforeEach(async () => {
    // Mock do repositório
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mock do uuid
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingService,
        {
          provide: TRAINING_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TrainingService>(TrainingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of trainings', async () => {
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

      mockRepository.findAll.mockResolvedValue(mockTrainings);

      const result = await service.findAll();

      expect(result).toEqual(mockTrainings);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a training when found', async () => {
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

      mockRepository.findById.mockResolvedValue(mockTraining);

      const result = await service.findById('1');

      expect(result).toEqual(mockTraining);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when training is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('create', () => {
    it('should create a new training', async () => {
      const createTrainingDto = {
        title: 'Novo Treino',
        description: 'Descrição do novo treino',
        place: 'Novo Local',
        start_date: '2025-06-22',
        start_time: '20:00',
        coach: 'Novo Coach',
        responsible: 'Novo Responsável',
        modality: 'Futsal',
      };

      const expectedTraining = new Training({
        id: mockUuid,
        ...createTrainingDto,
      });

      mockRepository.create.mockResolvedValue(expectedTraining);

      const result = await service.create(createTrainingDto);

      expect(result).toEqual(expectedTraining);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        id: mockUuid,
        ...createTrainingDto,
      }));
    });
  });

  describe('update', () => {
    it('should update an existing training', async () => {
      const updateTrainingDto = {
        title: 'Treino Atualizado',
      };

      const existingTraining = new Training({
        id: '1',
        title: 'Treino Antigo',
        description: 'Descrição do treino',
        place: 'Local 1',
        start_date: '2025-06-20',
        start_time: '18:00',
        coach: 'Coach 1',
        responsible: 'Responsável 1',
      });

      const updatedTraining = new Training({
        ...existingTraining,
        title: 'Treino Atualizado',
      });

      mockRepository.findById.mockResolvedValue(existingTraining);
      mockRepository.update.mockResolvedValue(updatedTraining);

      const result = await service.update('1', updateTrainingDto);

      expect(result).toEqual(updatedTraining);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateTrainingDto);
    });

    it('should throw NotFoundException when training to update is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update('999', { title: 'Novo Titulo' })).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when update fails', async () => {
      const existingTraining = new Training({
        id: '1',
        title: 'Treino Antigo',
        description: 'Descrição do treino',
        place: 'Local 1',
        start_date: '2025-06-20',
        start_time: '18:00',
        coach: 'Coach 1',
        responsible: 'Responsável 1',
      });

      mockRepository.findById.mockResolvedValue(existingTraining);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update('1', { title: 'Novo Titulo' })).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.update).toHaveBeenCalledWith('1', { title: 'Novo Titulo' });
    });
  });

  describe('delete', () => {
    it('should delete an existing training', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await service.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when delete fails', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.delete).toHaveBeenCalledWith('999');
    });
  });
});