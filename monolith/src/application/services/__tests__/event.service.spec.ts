import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../event.service';
import { EVENT_REPOSITORY } from '../../../domain/repositories/event.repository.interface';
import { Event, EventType } from '../../../domain/entities/event.entity';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('EventService', () => {
  let service: EventService;
  let mockRepository: any;
  const mockUuid = 'test-uuid-1234';

  beforeEach(async () => {
    // Mock do repositório
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByType: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mock do uuid
    (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: EVENT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const mockEvents = [
        new Event({
          id: '1',
          title: 'Festa da Atlética',
          description: 'Festa de confraternização',
          date: new Date('2025-07-15'),
          location: 'Clube Universitário',
          price: 50.00,
          type: EventType.PARTY,
        }),
        new Event({
          id: '2',
          title: 'Campeonato de Futsal',
          description: 'Torneio entre atléticas',
          date: new Date('2025-08-20'),
          location: 'Ginásio de Esportes',
          price: 10.00,
          type: EventType.SPORTS,
        }),
      ];

      mockRepository.findAll.mockResolvedValue(mockEvents);

      const result = await service.findAll();

      expect(result).toEqual(mockEvents);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return an event when found', async () => {
      const mockEvent = new Event({
        id: '1',
        title: 'Festa da Atlética',
        description: 'Festa de confraternização',
        date: new Date('2025-07-15'),
        location: 'Clube Universitário',
        price: 50.00,
        type: EventType.PARTY,
      });

      mockRepository.findById.mockResolvedValue(mockEvent);

      const result = await service.findById('1');

      expect(result).toEqual(mockEvent);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when event is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('findByType', () => {
    it('should return events by type', async () => {
      const mockEvents = [
        new Event({
          id: '1',
          title: 'Festa da Atlética',
          description: 'Festa de confraternização',
          date: new Date('2025-07-15'),
          location: 'Clube Universitário',
          price: 50.00,
          type: EventType.PARTY,
        }),
      ];

      mockRepository.findByType.mockResolvedValue(mockEvents);

      const result = await service.findByType(EventType.PARTY);

      expect(result).toEqual(mockEvents);
      expect(mockRepository.findByType).toHaveBeenCalledWith(EventType.PARTY);
    });

    it('should throw NotFoundException when event type is invalid', async () => {
      await expect(service.findByType('invalid_type')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findByType).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createEventDto = {
        title: 'Novo Evento',
        description: 'Descrição do novo evento',
        date: new Date('2025-09-10'),
        location: 'Local do Evento',
        price: 25.00,
        type: EventType.CULTURAL,
      };

      const expectedEvent = new Event({
        id: mockUuid,
        ...createEventDto,
      });

      mockRepository.create.mockResolvedValue(expectedEvent);

      const result = await service.create(createEventDto);

      expect(result).toEqual(expectedEvent);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUuid,
          ...createEventDto,
        })
      );
    });
  });

  describe('update', () => {
    it('should update an existing event', async () => {
      const updateEventDto = {
        title: 'Evento Atualizado',
        price: 35.00,
      };

      const existingEvent = new Event({
        id: '1',
        title: 'Evento Antigo',
        description: 'Descrição do evento',
        date: new Date('2025-07-15'),
        location: 'Local Antigo',
        price: 50.00,
        type: EventType.PARTY,
      });

      const updatedEvent = new Event({
        ...existingEvent,
        title: 'Evento Atualizado',
        price: 35.00,
      });

      mockRepository.findById.mockResolvedValue(existingEvent);
      mockRepository.update.mockResolvedValue(updatedEvent);

      const result = await service.update('1', updateEventDto);

      expect(result).toEqual(updatedEvent);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateEventDto);
    });

    it('should throw NotFoundException when event to update is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update('999', { title: 'Novo Título' })).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when update fails', async () => {
      const existingEvent = new Event({
        id: '1',
        title: 'Evento Antigo',
        description: 'Descrição do evento',
        date: new Date('2025-07-15'),
        location: 'Local Antigo',
        price: 50.00,
        type: EventType.PARTY,
      });

      mockRepository.findById.mockResolvedValue(existingEvent);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update('1', { title: 'Novo Título' })).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.update).toHaveBeenCalledWith('1', { title: 'Novo Título' });
    });
  });

  describe('delete', () => {
    it('should delete an existing event', async () => {
      const mockEvent = new Event({
        id: '1',
        title: 'Evento para Deletar',
        description: 'Este evento será deletado',
        date: new Date('2025-07-15'),
        location: 'Local do Evento',
        price: 50.00,
        type: EventType.PARTY,
      });

      mockRepository.findById.mockResolvedValue(mockEvent);
      mockRepository.delete.mockResolvedValue({ success: true, event: mockEvent });

      const result = await service.delete('1');

      expect(result).toEqual({
        success: true,
        eventId: '1',
        eventTitle: 'Evento para Deletar',
      });
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when event to delete is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should return success false when deletion fails', async () => {
      const mockEvent = new Event({
        id: '1',
        title: 'Evento para Deletar',
        description: 'Este evento será deletado',
        date: new Date('2025-07-15'),
        location: 'Local do Evento',
        price: 50.00,
        type: EventType.PARTY,
      });

      mockRepository.findById.mockResolvedValue(mockEvent);
      mockRepository.delete.mockResolvedValue({ success: false, event: null });

      const result = await service.delete('1');

      expect(result).toEqual({
        success: false,
        eventId: '1',
        eventTitle: null,
      });
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});