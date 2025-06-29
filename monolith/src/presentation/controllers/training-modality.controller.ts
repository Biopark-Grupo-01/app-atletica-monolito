import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';

import { TrainingModalityService } from '../../application/services/training-modality.service';
import { HateoasService } from '../../application/services/hateoas.service';
import { CreateTrainingModalityDto } from '../../application/dtos/create-training_modality.dto';
import { UpdateTrainingModalityDto } from '../../application/dtos/update-training_modality.dto';
import { TrainingModalityResponseDto } from '../../application/dtos/training_modality-response.dto';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';
// import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';

@ApiTags('Training Modalities')
@Controller('training-modalities')
export class TrainingModalityController {
  constructor(
    private readonly trainingModalityService: TrainingModalityService,
    private readonly hateoasService: HateoasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new training modality' })
  @ApiBody({ type: CreateTrainingModalityDto })
  @ApiResponse({ status: 201, type: SuccessResponse })
  @ApiResponse({ status: 400, type: ErrorResponse })
  async create(
    @Body() dto: CreateTrainingModalityDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<TrainingModalityResponseDto>>> {
    try {
      const modality = await this.trainingModalityService.create(dto);
      const withLinks = this.hateoasService.addLinksToItem(
        modality,
        'training-modalities',
      );
      return res
        .status(HttpStatus.CREATED)
        .json(
          new SuccessResponse(
            HttpStatus.CREATED,
            withLinks,
            'Created successfully',
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Error creating training modality';
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

  @Get()
  @ApiOperation({ summary: 'Get all training modalities' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  async findAll(
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<TrainingModalityResponseDto[]>>> {
    try {
      const modalities = await this.trainingModalityService.findAll();
      const withLinks = this.hateoasService.addLinksToCollection(
        modalities,
        'training-modalities',
      );
      const collectionLinks = this.hateoasService.createLinksForCollection(
        'training-modalities',
      );

      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(
            HttpStatus.OK,
            withLinks,
            'Retrieved successfully',
            collectionLinks,
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Error retrieving training modalities';
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
  @ApiOperation({ summary: 'Get a training modality by ID' })
  @ApiParam({ name: 'id', description: 'Modality ID' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<TrainingModalityResponseDto>>> {
    try {
      const modality = await this.trainingModalityService.findOne(id);
      const withLinks = this.hateoasService.addLinksToItem(
        modality,
        'training-modalities',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(
            HttpStatus.OK,
            withLinks,
            'Retrieved successfully',
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Error retrieving training modality';
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

  @Put(':id')
  @ApiOperation({ summary: 'Update a training modality' })
  @ApiParam({ name: 'id', description: 'Modality ID' })
  @ApiBody({ type: UpdateTrainingModalityDto })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  @ApiResponse({ status: 400, type: ErrorResponse })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrainingModalityDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<TrainingModalityResponseDto>>> {
    try {
      const updated = await this.trainingModalityService.update(id, dto);
      const withLinks = this.hateoasService.addLinksToItem(
        updated,
        'training-modalities',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(HttpStatus.OK, withLinks, 'Updated successfully'),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Error updating training modality';
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a training modality' })
  @ApiParam({ name: 'id', description: 'Modality ID' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<void>>> {
    try {
      await this.trainingModalityService.delete(id);
      const links = this.hateoasService.createLinksForCollection(
        'training-modalities',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<void>(
            HttpStatus.OK,
            undefined,
            'Deleted successfully',
            links,
          ),
        );
    } catch (error: any) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Error deleting training modality';
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
