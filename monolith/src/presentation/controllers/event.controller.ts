import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EventService } from '../../application/services/event.service';
import {
  CreateEventDto,
  UpdateEventDto,
  EventResponseDto,
} from '../../application/dtos/event.dto';
import { EventType } from '../../domain/entities/event.entity';
import { Request, Response } from 'express';
import { HateoasService } from '../../application/services/hateoas.service';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly hateoasService: HateoasService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List all events',
    description: 'Returns a list of all available events',
  })
  @ApiResponse({
    status: 200,
    description: 'Events list retrieved successfully',
    type: SuccessResponse,
  })
  async findAll(
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<EventResponseDto[]>>> {
    try {
      const events = await this.eventService.findAll();
      const eventsWithLinks = this.hateoasService.addLinksToCollection(
        events,
        'events',
      );
      const collectionLinks =
        this.hateoasService.createLinksForCollection('events');
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<EventResponseDto[]>(
            HttpStatus.OK,
            eventsWithLinks,
            'Events retrieved successfully',
            collectionLinks,
          ),
        );
    } catch (error: any) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while retrieving events';
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
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
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Event type not valid',
    type: ErrorResponse,
  })
  async findByType(
    @Param('type') type: string,
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<EventResponseDto[]>>> {
    try {
      const events = await this.eventService.findByType(type);
      const eventsWithLinks = this.hateoasService.addLinksToCollection(
        events,
        `events/type/${type}`,
      );
      const collectionLinks = this.hateoasService.createLinksForCollection(
        `events/type/${type}`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<EventResponseDto[]>(
            HttpStatus.OK,
            eventsWithLinks,
            'Events retrieved successfully',
            collectionLinks,
          ),
        );
    } catch (error: any) {
      const statusCode =
        error?.status && typeof error.status === 'number'
          ? (error.status as number)
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred';
      return res
        .status(statusCode)
        .json(
          new ErrorResponse(
            statusCode,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
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
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ErrorResponse,
  })
  async findById(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<EventResponseDto>>> {
    try {
      const event = await this.eventService.findById(id);
      const eventWithLinks = this.hateoasService.addLinksToItem(
        event,
        'events',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<EventResponseDto>(
            HttpStatus.OK,
            eventWithLinks,
            'Event retrieved successfully',
          ),
        );
    } catch (error: any) {
      const statusCode =
        error?.status && typeof error.status === 'number'
          ? (error.status as number)
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred';
      return res
        .status(statusCode)
        .json(
          new ErrorResponse(
            statusCode,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new event',
    description: 'Creates a new event with the provided data',
  })
  @ApiBody({ type: CreateEventDto, description: 'Event creation data' })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: SuccessResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorResponse })
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<EventResponseDto>>> {
    try {
      const event = await this.eventService.create(createEventDto);
      const eventWithLinks = this.hateoasService.addLinksToItem(
        event,
        'events',
      );
      return res
        .status(HttpStatus.CREATED)
        .json(
          new SuccessResponse<EventResponseDto>(
            HttpStatus.CREATED,
            eventWithLinks,
            'Event created successfully',
          ),
        );
    } catch (error: any) {
      const statusCode =
        error?.status && typeof error.status === 'number'
          ? (error.status as number)
          : HttpStatus.BAD_REQUEST;
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while creating the event';
      return res
        .status(statusCode)
        .json(
          new ErrorResponse(
            statusCode,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
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
  @ApiBody({ type: UpdateEventDto, description: 'Event update data' })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ErrorResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request', type: ErrorResponse })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() request: Request,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<EventResponseDto>>> {
    try {
      const event = await this.eventService.update(id, updateEventDto);
      const eventWithLinks = this.hateoasService.addLinksToItem(
        event,
        'events',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<EventResponseDto>(
            HttpStatus.OK,
            eventWithLinks,
            'Event updated successfully',
          ),
        );
    } catch (error: any) {
      const statusCode =
        error?.status && typeof error.status === 'number'
          ? (error.status as number)
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred';
      return res
        .status(statusCode)
        .json(
          new ErrorResponse(
            statusCode,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
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
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: ErrorResponse,
  })
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<object>>> {
    try {
      const result = await this.eventService.delete(id);
      return res.status(HttpStatus.OK).json(
        new SuccessResponse<object>(
          HttpStatus.OK,
          {
            message: 'Event deleted successfully',
            eventId: result.eventId,
            eventTitle: result.eventTitle,
          },
          'Event deleted successfully',
        ),
      );
    } catch (error: any) {
      const statusCode =
        error?.status && typeof error.status === 'number'
          ? (error.status as number)
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred';
      return res
        .status(statusCode)
        .json(
          new ErrorResponse(
            statusCode,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }
}
