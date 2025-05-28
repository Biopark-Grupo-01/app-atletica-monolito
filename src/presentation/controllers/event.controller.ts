import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { EventService } from '../../application/services/event.service';
import {
  CreateEventDto,
  UpdateEventDto,
  EventResponseDto,
} from '../../application/dtos/event.dto';
import { Event, EventType } from '../../domain/entities/event.entity';
import { Request } from 'express';
import { HateoasResponse } from '../../interfaces/http/hateoas.link';

@ApiTags('events')
@Controller('events') // Garantindo que o controlador use 'events' como rota
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({
    summary: 'List all events',
    description: 'Returns a list of all available events',
  })
  @ApiResponse({
    status: 200,
    description: 'Events list retrieved successfully',
    type: [EventResponseDto],
  })
  async findAll(@Req() request: Request): Promise<HateoasResponse<Event[]>> {
    const events = await this.eventService.findAll();

    // Create HATEOAS response
    const response = new HateoasResponse(events);

    // Base URL for building links
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    // Add related links
    response.addLink(`${baseUrl}/events`, 'self', 'GET');
    response.addLink(`${baseUrl}/events`, 'create', 'POST');

    // Add links for each event
    events.forEach((event) => {
      response.addLink(
        `${baseUrl}/events/${event.id}`,
        `event_${event.id}`,
        'GET',
      );
    });

    return response;
  }

  @Get('type/:type')
  @ApiOperation({
    summary: 'Find events by type',
    description: 'Returns events of the specified type',
  })
  @ApiParam({
    name: 'type',
    description: 'Event type',
    enum: EventType,
  })
  @ApiResponse({
    status: 200,
    description: 'Events found successfully',
    type: [EventResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Event type not valid' })
  async findByType(
    @Param('type') type: string,
    @Req() request: Request,
  ): Promise<HateoasResponse<Event[]>> {
    try {
      const events = await this.eventService.findByType(type);

      // Create HATEOAS response
      const response = new HateoasResponse(events);

      // Base URL for building links
      const baseUrl = `${request.protocol}://${request.get('host')}`;

      // Add related links
      response.addLink(`${baseUrl}/events`, 'all_events', 'GET');
      response.addLink(`${baseUrl}/events/type/${type}`, 'self', 'GET');

      // Add links for each event
      events.forEach((event) => {
        response.addLink(
          `${baseUrl}/events/${event.id}`,
          `event_${event.id}`,
          'GET',
        );
      });

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find event by ID',
    description: 'Returns a specific event based on the provided ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Event found successfully',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<HateoasResponse<Event>> {
    try {
      const event = await this.eventService.findById(id);

      // Create HATEOAS response
      const response = new HateoasResponse(event);

      // Base URL for building links
      const baseUrl = `${request.protocol}://${request.get('host')}`;

      // Add related links
      response.addLink(`${baseUrl}/events/${id}`, 'self', 'GET');
      response.addLink(`${baseUrl}/events`, 'collection', 'GET');
      response.addLink(`${baseUrl}/events/${id}`, 'update', 'PUT');
      response.addLink(`${baseUrl}/events/${id}`, 'delete', 'DELETE');

      // Add link to other events of the same type
      response.addLink(
        `${baseUrl}/events/type/${event.type}`,
        'events_same_type',
        'GET',
      );

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new event',
    description: 'Creates a new event with the provided data',
  })
  @ApiBody({
    type: CreateEventDto,
    description: 'Event creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventResponseDto,
  })
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request,
  ): Promise<HateoasResponse<Event>> {
    const event = await this.eventService.create(createEventDto);

    // Create HATEOAS response
    const response = new HateoasResponse(event);

    // Base URL for building links
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    // Add related links
    response.addLink(`${baseUrl}/events/${event.id}`, 'self', 'GET');
    response.addLink(`${baseUrl}/events`, 'collection', 'GET');
    response.addLink(`${baseUrl}/events/${event.id}`, 'update', 'PUT');
    response.addLink(`${baseUrl}/events/${event.id}`, 'delete', 'DELETE');

    // Add link to other events of the same type
    response.addLink(
      `${baseUrl}/events/type/${event.type}`,
      'events_same_type',
      'GET',
    );

    return response;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an event',
    description: 'Updates an existing event with the provided data',
  })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateEventDto,
    description: 'Event update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() request: Request,
  ): Promise<HateoasResponse<Event>> {
    try {
      const event = await this.eventService.update(id, updateEventDto);

      // Create HATEOAS response
      const response = new HateoasResponse(event);

      // Base URL for building links
      const baseUrl = `${request.protocol}://${request.get('host')}`;

      // Add related links
      response.addLink(`${baseUrl}/events/${id}`, 'self', 'GET');
      response.addLink(`${baseUrl}/events`, 'collection', 'GET');
      response.addLink(`${baseUrl}/events/${id}`, 'update', 'PUT');
      response.addLink(`${baseUrl}/events/${id}`, 'delete', 'DELETE');

      // Add link to other events of the same type
      response.addLink(
        `${baseUrl}/events/type/${event.type}`,
        'events_same_type',
        'GET',
      );

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an event',
    description: 'Deletes an event based on the provided ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        eventId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        eventTitle: {
          type: 'string',
          example: 'Annual Athletic Party',
          nullable: true,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async delete(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<HateoasResponse<{
    success: boolean;
    eventId: string;
    eventTitle: string | null;
  }>> {
    try {
      const result = await this.eventService.delete(id);

      // Create HATEOAS response
      const response = new HateoasResponse(result);

      // Base URL for building links
      const baseUrl = `${request.protocol}://${request.get('host')}`;

      // Add related links
      response.addLink(`${baseUrl}/events`, 'collection', 'GET');
      response.addLink(`${baseUrl}/events`, 'create', 'POST');

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}