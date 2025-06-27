import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from '../ticket.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { Ticket, TicketStatus, TicketStatusEnum } from '../../../domain/entities/ticket.entity';
import { of, throwError } from 'rxjs';
import { CreateTicketDto } from '../../dtos/create-ticket.dto';
import { UpdateTicketDto } from '../../dtos/update-ticket.dto';

describe('TicketService', () => {
  let service: TicketService;
  let mockTicketRepository: any;
  let mockHttpService: any;
  let mockConfigService: any;

  const mockMonolithUrl = 'http://monolith-service:3000';
  
  const mockTicket = {
    id: 'ticket-1',
    name: 'VIP Ticket',
    description: 'VIP access to event',
    price: 100.00,
    status: TicketStatusEnum.AVAILABLE,
    eventId: 'event-1',
    userId: null,
    purchasedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    reserve: jest.fn(),
    purchase: jest.fn(),
    cancel: jest.fn(),
    makeAvailable: jest.fn(),
  };

  beforeEach(async () => {
    // Mock do repositório de tickets
    mockTicketRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEventId: jest.fn(),
      findByUserId: jest.fn(),
      findAvailableByEventId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mock do HttpService
    mockHttpService = {
      get: jest.fn(),
    };

    // Mock do ConfigService
    mockConfigService = {
      get: jest.fn().mockReturnValue(mockMonolithUrl),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: 'ITicketRepository',
          useValue: mockTicketRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tickets', async () => {
      const mockTickets = [
        { ...mockTicket },
        { ...mockTicket, id: 'ticket-2', name: 'Standard Ticket', price: 50.00 },
      ];

      mockTicketRepository.findAll.mockResolvedValue(mockTickets);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockTicketRepository.findAll).toHaveBeenCalled();
      expect(result[0].id).toEqual('ticket-1');
      expect(result[1].id).toEqual('ticket-2');
    });
  });

  describe('findById', () => {
    it('should return a ticket when found', async () => {
      mockTicketRepository.findById.mockResolvedValue(mockTicket);

      const result = await service.findById('ticket-1');

      expect(result).toEqual(expect.objectContaining({
        id: 'ticket-1',
        name: 'VIP Ticket',
        price: 100.00,
      }));
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      mockTicketRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('findByEventId', () => {
    it('should return tickets for a valid event ID', async () => {
      const mockResponse = { data: { id: 'event-1', title: 'Event Test' } };
      mockHttpService.get.mockReturnValue(of(mockResponse));
      
      const mockTickets = [
        { ...mockTicket },
        { ...mockTicket, id: 'ticket-2', name: 'Standard Ticket', price: 50.00 },
      ];
      
      mockTicketRepository.findByEventId.mockResolvedValue(mockTickets);

      const result = await service.findByEventId('event-1');

      expect(result).toHaveLength(2);
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/events/exists/event-1`);
      expect(mockTicketRepository.findByEventId).toHaveBeenCalledWith('event-1');
    });

    it('should throw NotFoundException when event does not exist', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Event not found')));

      await expect(service.findByEventId('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/events/exists/non-existent`);
      expect(mockTicketRepository.findByEventId).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return tickets for a valid user ID', async () => {
      const mockResponse = { data: { id: 'user-1', name: 'John Doe' } };
      mockHttpService.get.mockReturnValue(of(mockResponse));
      
      const mockTickets = [
        { ...mockTicket, userId: 'user-1', status: TicketStatusEnum.AVAILABLE },
      ];
      
      mockTicketRepository.findByUserId.mockResolvedValue(mockTickets);

      const result = await service.findByUserId('user-1');

      expect(result).toHaveLength(1);
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/users/exists/user-1`);
      expect(mockTicketRepository.findByUserId).toHaveBeenCalledWith('user-1');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('User not found')));

      await expect(service.findByUserId('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/users/exists/non-existent`);
      expect(mockTicketRepository.findByUserId).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a ticket for a valid event', async () => {
      const mockResponse = { data: { id: 'event-1', title: 'Event Test' } };
      mockHttpService.get.mockReturnValue(of(mockResponse));
      
      const createTicketDto: CreateTicketDto = {
        name: 'VIP Ticket',
        description: 'VIP access to event',
        price: 100.00,
        eventId: 'event-1',
      };

      mockTicketRepository.create.mockImplementation((ticket) => Promise.resolve({
        ...ticket,
        id: 'new-ticket',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await service.create(createTicketDto);

      expect(result).toEqual(expect.objectContaining({
        id: 'new-ticket',
        name: 'VIP Ticket',
        price: 100.00,
        status: TicketStatusEnum.AVAILABLE,
        eventId: 'event-1',
      }));
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/events/exists/event-1`);
      expect(mockTicketRepository.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when event does not exist', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('Event not found')));
      
      const createTicketDto: CreateTicketDto = {
        name: 'VIP Ticket',
        description: 'VIP access to event',
        price: 100.00,
        eventId: 'non-existent',
      };

      await expect(service.create(createTicketDto)).rejects.toThrow(NotFoundException);
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/events/exists/non-existent`);
      expect(mockTicketRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a ticket when found', async () => {
      mockTicketRepository.findById.mockResolvedValue(mockTicket);
      
      const updateTicketDto: UpdateTicketDto = {
        name: 'Updated Ticket',
        price: 150.00,
      };

      const updatedTicket = {
        ...mockTicket,
        name: 'Updated Ticket',
        price: 150.00,
      };

      mockTicketRepository.update.mockResolvedValue(updatedTicket);

      const result = await service.update('ticket-1', updateTicketDto);

      expect(result).toEqual(expect.objectContaining({
        id: 'ticket-1',
        name: 'Updated Ticket',
        price: 150.00,
      }));
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
      expect(mockTicketRepository.update).toHaveBeenCalledWith('ticket-1', updateTicketDto);
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      mockTicketRepository.findById.mockResolvedValue(null);
      
      const updateTicketDto: UpdateTicketDto = {
        name: 'Updated Ticket',
      };

      await expect(service.update('non-existent', updateTicketDto)).rejects.toThrow(NotFoundException);
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(mockTicketRepository.update).not.toHaveBeenCalled();
    });

    it('should verify event when changing eventId', async () => {
      mockTicketRepository.findById.mockResolvedValue(mockTicket);
      
      const mockResponse = { data: { id: 'event-2', title: 'Another Event' } };
      mockHttpService.get.mockReturnValue(of(mockResponse));
      
      const updateTicketDto: UpdateTicketDto = {
        eventId: 'event-2',
      };

      const updatedTicket = {
        ...mockTicket,
        eventId: 'event-2',
      };

      mockTicketRepository.update.mockResolvedValue(updatedTicket);

      const result = await service.update('ticket-1', updateTicketDto);

      expect(result.eventId).toBe('event-2');
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/events/exists/event-2`);
    });
  });

  describe('delete', () => {
    it('should delete a ticket when found', async () => {
      mockTicketRepository.findById.mockResolvedValue(mockTicket);
      mockTicketRepository.delete.mockResolvedValue(undefined);

      await service.delete('ticket-1');

      expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
      expect(mockTicketRepository.delete).toHaveBeenCalledWith('ticket-1');
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      mockTicketRepository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(mockTicketRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('reserveTicket', () => {
    it('should reserve an available ticket for a valid user', async () => {
      const ticket = new Ticket(mockTicket);
      mockTicketRepository.findById.mockResolvedValue(ticket);
      
      const mockResponse = { data: { id: 'user-1', name: 'John Doe' } };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const reservedTicket = {
        ...mockTicket,
        userId: 'user-1',
        status: TicketStatusEnum.RESERVED };
      
      mockTicketRepository.update.mockResolvedValue(reservedTicket);

      const result = await service.reserveTicket('ticket-1', 'user-1');

      expect(result).toEqual(expect.objectContaining({
        id: 'ticket-1',
        status: TicketStatusEnum.SOLD, userId: 'user-1',
      }));
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/users/exists/user-1`);
      expect(mockTicketRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      mockTicketRepository.findById.mockResolvedValue(null);

      await expect(service.reserveTicket('non-existent', 'user-1')).rejects.toThrow(NotFoundException);
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(mockTicketRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockTicketRepository.findById.mockResolvedValue(mockTicket);
      mockHttpService.get.mockReturnValue(throwError(() => new Error('User not found')));

      await expect(service.reserveTicket('ticket-1', 'non-existent')).rejects.toThrow(NotFoundException);
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/users/exists/non-existent`);
      expect(mockTicketRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('purchaseTicket', () => {
    it('should purchase an available ticket for a valid user', async () => {
      const ticket = new Ticket(mockTicket);
      mockTicketRepository.findById.mockResolvedValue(ticket);
      
      const mockResponse = { data: { id: 'user-1', name: 'John Doe' } };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const purchasedTicket = {
        ...mockTicket,
        userId: 'user-1',
        status: TicketStatusEnum.AVAILABLE,
        purchasedAt: new Date(),
      };
      
      mockTicketRepository.update.mockResolvedValue(purchasedTicket);

      const result = await service.purchaseTicket('ticket-1', 'user-1');

      expect(result).toEqual(expect.objectContaining({
        id: 'ticket-1',
        status: TicketStatusEnum.SOLD, userId: 'user-1',
        purchasedAt: expect.any(Date),
      }));
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
      expect(mockHttpService.get).toHaveBeenCalledWith(`${mockMonolithUrl}/api/microservices/users/exists/user-1`);
      expect(mockTicketRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      mockTicketRepository.findById.mockResolvedValue(null);

      await expect(service.purchaseTicket('non-existent', 'user-1')).rejects.toThrow(NotFoundException);
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(mockTicketRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('cancelTicket', () => {
    it('should cancel a ticket when found', async () => {
      const ticket = new Ticket(mockTicket);
      mockTicketRepository.findById.mockResolvedValue(ticket);

      const cancelledTicket = {
        ...mockTicket,
        status: TicketStatusEnum.RESERVED };
      
      mockTicketRepository.update.mockResolvedValue(cancelledTicket);

      const result = await service.cancelTicket('ticket-1');

      expect(result).toEqual(expect.objectContaining({
        id: 'ticket-1',
        status: TicketStatusEnum.RESERVED }));
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('ticket-1');
      expect(mockTicketRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      mockTicketRepository.findById.mockResolvedValue(null);

      await expect(service.cancelTicket('non-existent')).rejects.toThrow(NotFoundException);
      expect(mockTicketRepository.findById).toHaveBeenCalledWith('non-existent');
      expect(mockTicketRepository.update).not.toHaveBeenCalled();
    });
  });
});
