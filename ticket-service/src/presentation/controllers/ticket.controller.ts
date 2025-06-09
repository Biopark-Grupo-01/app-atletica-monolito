import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TicketService } from '../../application/services/ticket.service';
import { CreateTicketDto } from '../../application/dtos/create-ticket.dto';
import { UpdateTicketDto } from '../../application/dtos/update-ticket.dto';
import { TicketResponseDto } from '../../application/dtos/ticket-response.dto';

@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async findAll(): Promise<TicketResponseDto[]> {
    return this.ticketService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TicketResponseDto> {
    return this.ticketService.findById(id);
  }

  @Get('event/:eventId')
  async findByEventId(@Param('eventId') eventId: string): Promise<TicketResponseDto[]> {
    return this.ticketService.findByEventId(eventId);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<TicketResponseDto[]> {
    return this.ticketService.findByUserId(userId);
  }
  
  @Get('event/:eventId/available')
  async findAvailableByEventId(@Param('eventId') eventId: string): Promise<TicketResponseDto[]> {
    return this.ticketService.findAvailableByEventId(eventId);
  }

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto): Promise<TicketResponseDto> {
    return this.ticketService.create(createTicketDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<TicketResponseDto> {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.ticketService.delete(id);
  }

  @Post(':id/reserve/:userId')
  async reserveTicket(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<TicketResponseDto> {
    return this.ticketService.reserveTicket(id, userId);
  }

  @Post(':id/purchase/:userId')
  async purchaseTicket(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<TicketResponseDto> {
    return this.ticketService.purchaseTicket(id, userId);
  }

  @Post(':id/cancel')
  async cancelTicket(@Param('id') id: string): Promise<TicketResponseDto> {
    return this.ticketService.cancelTicket(id);
  }
}