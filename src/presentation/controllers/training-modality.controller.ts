import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { TrainingModalityService } from '../../application/services/training-modality.service';
import { CreateTrainingModalityDto } from '../../application/dtos/create-training_modality.dto';
import { TrainingModalityResponseDto } from '../../application/dtos/training_modality-response.dto';
import { HateoasResponse } from '../../interfaces/http/hateoas.link';

@Controller('training-modalities')
export class TrainingModalityController {
  constructor(
    private readonly trainingModalityService: TrainingModalityService,
  ) {}

  @Post()
  async create(
    @Body() createTrainingModalityDto: CreateTrainingModalityDto,
    @Req() request: Request,
  ): Promise<HateoasResponse<TrainingModalityResponseDto>> {
    const trainingModality = await this.trainingModalityService.create(
      createTrainingModalityDto,
    );
    const response = new HateoasResponse(trainingModality);

    const baseUrl = `${request.protocol}://${request.get('host')}`;
    const id = trainingModality.id;

    response.addLink(`${baseUrl}/training-modalities/${id}`, 'self', 'GET');
    response.addLink(`${baseUrl}/training-modalities`, 'collection', 'GET');
    response.addLink(`${baseUrl}/training-modalities/${id}`, 'update', 'PUT');
    response.addLink(
      `${baseUrl}/training-modalities/${id}`,
      'delete',
      'DELETE',
    );

    return response;
  }

  @Get()
  async findAll(
    @Req() request: Request,
  ): Promise<HateoasResponse<TrainingModalityResponseDto[]>> {
    const modalities = await this.trainingModalityService.findAll();
    const response = new HateoasResponse(modalities);

    const baseUrl = `${request.protocol}://${request.get('host')}`;
    response.addLink(`${baseUrl}/training-modalities`, 'self', 'GET');
    response.addLink(`${baseUrl}/training-modalities`, 'create', 'POST');

    modalities.forEach((modality) => {
      response.addLink(
        `${baseUrl}/training-modalities/${modality.id}`,
        `training_modality_${modality.id}`,
        'GET',
      );
    });

    return response;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<HateoasResponse<TrainingModalityResponseDto>> {
    const modality = await this.trainingModalityService.findOne(id);
    if (!modality) {
      throw new NotFoundException('Training Modality not found');
    }

    const response = new HateoasResponse(modality);
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    response.addLink(`${baseUrl}/training-modalities/${id}`, 'self', 'GET');
    response.addLink(`${baseUrl}/training-modalities`, 'collection', 'GET');
    response.addLink(`${baseUrl}/training-modalities/${id}`, 'update', 'PUT');
    response.addLink(
      `${baseUrl}/training-modalities/${id}`,
      'delete',
      'DELETE',
    );

    return response;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrainingModalityDto: Partial<CreateTrainingModalityDto>,
    @Req() request: Request,
  ): Promise<HateoasResponse<TrainingModalityResponseDto>> {
    const updated = await this.trainingModalityService.update(
      id,
      updateTrainingModalityDto,
    );
    if (!updated) {
      throw new NotFoundException('Training Modality not found');
    }

    const response = new HateoasResponse(updated);
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    response.addLink(`${baseUrl}/training-modalities/${id}`, 'self', 'GET');
    response.addLink(`${baseUrl}/training-modalities`, 'collection', 'GET');
    response.addLink(`${baseUrl}/training-modalities/${id}`, 'update', 'PUT');
    response.addLink(
      `${baseUrl}/training-modalities/${id}`,
      'delete',
      'DELETE',
    );

    return response;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const trainingModality = await this.trainingModalityService.findOne(id);
    if (!trainingModality) {
      throw new NotFoundException('Training Modality not found.');
    }
    await this.trainingModalityService.delete(id);
  }
}
