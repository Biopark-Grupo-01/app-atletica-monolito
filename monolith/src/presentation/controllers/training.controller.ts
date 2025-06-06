import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';
import { TrainingService } from '../../application/services/training.service';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
  TrainingResponseDto,
} from '../../application/dtos/training.dto';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';
import { Response } from 'express';
import { HateoasService } from '../../application/services/hateoas.service';

@ApiTags('Trainings')
@Controller('trainings')
export class TrainingController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly hateoasService: HateoasService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all trainings',
    description: 'Returns a list of all registered trainings.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of trainings successfully retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(TrainingResponseDto) },
            },
            _links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  href: { type: 'string' },
                  rel: { type: 'string' },
                  type: { type: 'string' },
                },
              },
              description: 'HATEOAS links for the collection',
            },
          },
        },
      ],
    },
  })
  async findAll(
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<TrainingResponseDto[]>>> {
    try {
      const trainings = await this.trainingService.findAll();
      const trainingsAsDto = trainings.map(
        (t) => t as unknown as TrainingResponseDto,
      );
      const trainingsWithLinks = this.hateoasService.addLinksToCollection(
        trainingsAsDto,
        'trainings',
      );
      const collectionLinks =
        this.hateoasService.createLinksForCollection('trainings');

      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<TrainingResponseDto[]>(
            HttpStatus.OK,
            trainingsWithLinks,
            'Trainings retrieved successfully',
            collectionLinks,
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while retrieving trainings';
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

  @Get(':id')
  @ApiOperation({
    summary: 'Find a training by ID',
    description: 'Returns a specific training based on the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the training to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Training successfully found.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponse) },
        {
          properties: {
            data: { $ref: getSchemaPath(TrainingResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Training not found.',
    schema: { $ref: getSchemaPath(ErrorResponse) },
  })
  async findById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<TrainingResponseDto>>> {
    try {
      const training = await this.trainingService.findById(id);
      const trainingAsDto = training as unknown as TrainingResponseDto;
      const trainingWithLinks = this.hateoasService.addLinksToItem(
        trainingAsDto,
        'trainings',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<TrainingResponseDto>(
            HttpStatus.OK,
            trainingWithLinks,
            'Training retrieved successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while retrieving the training';
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

  @Post()
  @ApiOperation({
    summary: 'Create a new training',
    description: 'Creates a new training with the provided data.',
  })
  @ApiBody({
    type: CreateTrainingDto,
    description: 'Data for creating the new training.',
  })
  @ApiResponse({
    status: 201,
    description: 'Training successfully created.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponse) },
        {
          properties: {
            data: { $ref: getSchemaPath(TrainingResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
    schema: { $ref: getSchemaPath(ErrorResponse) },
  })
  async create(
    @Body() createTrainingDto: CreateTrainingDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<TrainingResponseDto>>> {
    try {
      const training = await this.trainingService.create(createTrainingDto);
      const trainingAsDto = training as unknown as TrainingResponseDto;
      const trainingWithLinks = this.hateoasService.addLinksToItem(
        trainingAsDto,
        'trainings',
      );
      return res
        .status(HttpStatus.CREATED)
        .json(
          new SuccessResponse<TrainingResponseDto>(
            HttpStatus.CREATED,
            trainingWithLinks,
            'Training created successfully',
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while creating the training';
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing training',
    description: 'Updates the data of an existing training.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the training to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTrainingDto,
    description: 'Data for updating the training.',
  })
  @ApiResponse({
    status: 200,
    description: 'Training successfully updated.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponse) },
        {
          properties: {
            data: { $ref: getSchemaPath(TrainingResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Training not found.',
    schema: { $ref: getSchemaPath(ErrorResponse) },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided.',
    schema: { $ref: getSchemaPath(ErrorResponse) },
  })
  async update(
    @Param('id') id: string,
    @Body() updateTrainingDto: UpdateTrainingDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<TrainingResponseDto>>> {
    try {
      const training = await this.trainingService.update(id, updateTrainingDto);
      const trainingAsDto = training as unknown as TrainingResponseDto;
      const trainingWithLinks = this.hateoasService.addLinksToItem(
        trainingAsDto,
        'trainings',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<TrainingResponseDto>(
            HttpStatus.OK,
            trainingWithLinks,
            'Training updated successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while updating the training';
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a training',
    description: 'Deletes a training based on the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the training to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Training successfully deleted.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponse) },
        {
          properties: {
            data: {
              type: 'object',
              example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                message: 'Training deleted successfully',
              },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Training not found.',
    schema: { $ref: getSchemaPath(ErrorResponse) },
  })
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<{ id: string; message: string }>>> {
    try {
      await this.trainingService.delete(id);
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<{ id: string; message: string }>(
            HttpStatus.OK,
            { id, message: 'Training deleted successfully' },
            'Training deleted successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while deleting the training';
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
}
