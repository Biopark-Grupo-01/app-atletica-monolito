import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from '../ticket.controller';
import { TicketService } from '../../../application/services/ticket.service';
import { CreateTicketDto } from '../../../application/dtos/create-ticket.dto';
import { UpdateTicketDto } from '../../../application/dtos/update-ticket.dto';
import { TicketStatusEnum, UserTicketStatusEnum } from '../../../domain/entities/ticket.entity';

describe('TicketController', () => {
  let controller: TicketController;
  let mockTicketService: any;

  const mockTicketDto = {
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
  };

  beforeEach(async () => {
    // Mock do serviço de tickets
    mockTicketService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEventId: jest.fn(),
      findByUserId: jest.fn(),
      findAvailableByEventId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      reserveTicket: jest.fn(),
      updateTicketStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockTicketService,
        },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tickets', async () => {
      const mockTickets = [mockTicketDto, { ...mockTicketDto, id: 'ticket-2' }];
      mockTicketService.findAll.mockResolvedValue(mockTickets);

      const result = await controller.findAll();

      expect(result).toEqual(mockTickets);
      expect(mockTicketService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a ticket by id', async () => {
      mockTicketService.findById.mockResolvedValue(mockTicketDto);

      const result = await controller.findById('ticket-1');

      expect(result).toEqual(mockTicketDto);
      expect(mockTicketService.findById).toHaveBeenCalledWith('ticket-1');
    });
  });

  describe('findByEventId', () => {
    it('should return tickets for an event', async () => {
      const mockTickets = [mockTicketDto, { ...mockTicketDto, id: 'ticket-2' }];
      mockTicketService.findByEventId.mockResolvedValue(mockTickets);

      const result = await controller.findByEventId('event-1');

      expect(result).toEqual(mockTickets);
      expect(mockTicketService.findByEventId).toHaveBeenCalledWith('event-1');
    });
  });

  describe('findByUserId', () => {
    it('should return tickets for a user', async () => {
      const mockTickets = [
        { ...mockTicketDto, userId: 'user-1', status: TicketStatusEnum.AVAILABLE },
      ];
      mockTicketService.findByUserId.mockResolvedValue(mockTickets);

      const result = await controller.findByUserId('user-1');

      expect(result).toEqual(mockTickets);
      expect(mockTicketService.findByUserId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findAvailableByEventId', () => {
    it('should return available tickets for an event', async () => {
      const mockTickets = [mockTicketDto, { ...mockTicketDto, id: 'ticket-2' }];
      mockTicketService.findAvailableByEventId.mockResolvedValue(mockTickets);

      const result = await controller.findAvailableByEventId('event-1');

      expect(result).toEqual(mockTickets);
      expect(mockTicketService.findAvailableByEventId).toHaveBeenCalledWith('event-1');
    });
  });

  describe('create', () => {
    it('should create a ticket', async () => {
      const createTicketDto: CreateTicketDto = {
        name: 'VIP Ticket',
        description: 'VIP access to event',
        price: 100.00,
        eventId: 'event-1',
      };
      mockTicketService.create.mockResolvedValue(mockTicketDto);

      const result = await controller.create(createTicketDto);

      expect(result).toEqual(mockTicketDto);
      expect(mockTicketService.create).toHaveBeenCalledWith(createTicketDto);
    });
  });

  describe('update', () => {
    it('should update a ticket', async () => {
      const updateTicketDto: UpdateTicketDto = {
        name: 'Updated Ticket',
        price: 150.00,
      };
      
      const updatedTicket = {
        ...mockTicketDto,
        name: 'Updated Ticket',
        price: 150.00,
      };
      
      mockTicketService.update.mockResolvedValue(updatedTicket);

      const result = await controller.update('ticket-1', updateTicketDto);

      expect(result).toEqual(updatedTicket);
      expect(mockTicketService.update).toHaveBeenCalledWith('ticket-1', updateTicketDto);
    });
  });

  describe('delete', () => {
    it('should delete a ticket', async () => {
      mockTicketService.delete.mockResolvedValue(undefined);

      await controller.delete('ticket-1');

      expect(mockTicketService.delete).toHaveBeenCalledWith('ticket-1');
    });
  });

  describe('reserveTicket', () => {
    it('should reserve a ticket for a user', async () => {
      const reservedTicket = {
        ...mockTicketDto,
        userId: 'user-1',
        status: TicketStatusEnum.RESERVED };
      
      mockTicketService.reserveTicket.mockResolvedValue(reservedTicket);

      const result = await controller.reserveTicket('ticket-1', 'user-1');

      expect(result).toEqual(reservedTicket);
      expect(mockTicketService.reserveTicket).toHaveBeenCalledWith('ticket-1', 'user-1');
    });
  });

  describe('updateTicketStatus', () => {
    it('should purchase a ticket for a user', async () => {
      const purchasedTicket = {
        ...mockTicketDto,
        userId: 'user-1',
        status: TicketStatusEnum.SOLD,
        purchasedAt: new Date(),
      };
      
      mockTicketService.updateTicketStatus.mockResolvedValue(purchasedTicket);

      const result = await controller.updateTicketStatus('ticket-1', {
        status: 'sold',
        userId: 'user-1'
      });

      expect(result).toEqual(purchasedTicket);
      expect(mockTicketService.updateTicketStatus).toHaveBeenCalledWith('ticket-1', {
        status: 'sold',
        userId: 'user-1'
      });
    });

    it('should cancel a ticket', async () => {
      const cancelledTicket = {
        ...mockTicketDto,
        status: TicketStatusEnum.CANCELLED
      };
      
      mockTicketService.updateTicketStatus.mockResolvedValue(cancelledTicket);

      const result = await controller.updateTicketStatus('ticket-1', {
        status: 'cancelled'
      });

      expect(result).toEqual(cancelledTicket);
      expect(mockTicketService.updateTicketStatus).toHaveBeenCalledWith('ticket-1', {
        status: 'cancelled'
      });
    });

    it('should mark ticket as used', async () => {
      const usedTicket = {
        ...mockTicketDto,
        userStatus: UserTicketStatusEnum.USED,
        usedAt: new Date(),
      };
      
      mockTicketService.updateTicketStatus.mockResolvedValue(usedTicket);

      const result = await controller.updateTicketStatus('ticket-1', {
        userStatus: 'used'
      });

      expect(result).toEqual(usedTicket);
      expect(mockTicketService.updateTicketStatus).toHaveBeenCalledWith('ticket-1', {
        userStatus: 'used'
      });
    });
  });
});
