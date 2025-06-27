import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TicketGatewayService } from '../services/ticket-gateway.service';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { UpdateTicketDto } from '../dtos/update-ticket.dto';
import { TicketResponseDto } from '../dtos/ticket-response.dto';

@ApiTags('Tickets Gateway')
@Controller('tickets')
export class TicketGatewayController {
  constructor(private readonly ticketGatewayService: TicketGatewayService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os tickets' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tickets retornada com sucesso',
    type: [TicketResponseDto],
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Parâmetros de query opcionais',
  })
  async findAll(@Query() query: Record<string, unknown>): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest('GET', '', undefined, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ticket por ID' })
  @ApiParam({ name: 'id', description: 'ID do ticket' })
  @ApiResponse({
    status: 200,
    description: 'Ticket encontrado',
    type: TicketResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ticket não encontrado' })
  async findById(@Param('id') id: string): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest('GET', `/${id}`);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Buscar tickets por evento' })
  @ApiParam({ name: 'eventId', description: 'ID do evento' })
  @ApiResponse({
    status: 200,
    description: 'Tickets do evento retornados',
    type: [TicketResponseDto],
  })
  async findByEventId(@Param('eventId') eventId: string): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest('GET', `/event/${eventId}`);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Buscar tickets por usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Tickets do usuário retornados',
    type: [TicketResponseDto],
  })
  async findByUserId(@Param('userId') userId: string): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest('GET', `/user/${userId}`);
  }

  @Get('event/:eventId/available')
  @ApiOperation({ summary: 'Buscar tickets disponíveis por evento' })
  @ApiParam({ name: 'eventId', description: 'ID do evento' })
  @ApiResponse({
    status: 200,
    description: 'Tickets disponíveis retornados',
    type: [TicketResponseDto],
  })
  async findAvailableByEventId(
    @Param('eventId') eventId: string,
  ): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest(
      'GET',
      `/event/${eventId}/available`,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo ticket' })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({
    status: 201,
    description: 'Ticket criado com sucesso',
    type: TicketResponseDto,
  })
  async create(@Body() createTicketDto: CreateTicketDto): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest('POST', '', createTicketDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar ticket' })
  @ApiParam({ name: 'id', description: 'ID do ticket' })
  @ApiBody({ type: UpdateTicketDto })
  @ApiResponse({
    status: 200,
    description: 'Ticket atualizado com sucesso',
    type: TicketResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest(
      'PUT',
      `/${id}`,
      updateTicketDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar ticket' })
  @ApiParam({ name: 'id', description: 'ID do ticket' })
  @ApiResponse({ status: 200, description: 'Ticket deletado com sucesso' })
  async delete(@Param('id') id: string): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest('DELETE', `/${id}`);
  }

  @Post(':id/reserve/:userId')
  @ApiOperation({ summary: 'Reservar ticket' })
  @ApiParam({ name: 'id', description: 'ID do ticket' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Ticket reservado com sucesso',
    type: TicketResponseDto,
  })
  async reserveTicket(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest(
      'POST',
      `/${id}/reserve/${userId}`,
    );
  }

  @Put(':id/status')
  @ApiOperation({
    summary: 'Atualizar status do ticket',
    description:
      'Atualiza o status do ticket e/ou userStatus. Exemplos de uso: reservar, comprar, cancelar, usar, expirar ticket',
  })
  @ApiParam({ name: 'id', description: 'ID do ticket' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['available', 'reserved', 'sold', 'used', 'cancelled'],
          description: 'Status do ticket (disponibilidade)',
        },
        userStatus: {
          type: 'string',
          enum: [
            'not_paid',
            'paid',
            'used',
            'expired',
            'cancelled',
            'refunded',
          ],
          description: 'Status relacionado ao usuário',
        },
        userId: {
          type: 'string',
          description: 'ID do usuário (obrigatório para reservar/comprar)',
        },
      },
    },
    examples: {
      purchase: {
        summary: 'Comprar ticket',
        value: { status: 'sold', userId: 'user123' },
      },
      use: {
        summary: 'Usar ticket',
        value: { userStatus: 'used' },
      },
      cancel: {
        summary: 'Cancelar ticket',
        value: { status: 'cancelled' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Status do ticket atualizado com sucesso',
    type: TicketResponseDto,
  })
  async updateTicketStatus(
    @Param('id') id: string,
    @Body()
    updateData: { status?: string; userStatus?: string; userId?: string },
  ): Promise<unknown> {
    return this.ticketGatewayService.proxyRequest(
      'PUT',
      `/${id}/status`,
      updateData,
    );
  }
}
