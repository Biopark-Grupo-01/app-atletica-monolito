import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TrainingService } from '../../application/services/training.service';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
  TrainingResponseDto,
} from '../../application/dtos/training.dto';
import { Training } from '../../domain/entities/training.entity';
import { Request } from 'express';
import { HateoasResponse } from '../http/hateoas.link';

@ApiTags('trainings')
@Controller('trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os treinos',
    description: 'Retorna uma lista de todos os treinos cadastrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de treinos recuperada com sucesso',
    type: [TrainingResponseDto],
  })
  async findAll(@Req() request: Request): Promise<HateoasResponse<Training[]>> {
    const trainings = await this.trainingService.findAll();

    const response = new HateoasResponse(trainings);

    const baseUrl = `${request.protocol}://${request.get('host')}`;

    response.addLink(`${baseUrl}/trainings`, 'self', 'GET');
    response.addLink(`${baseUrl}/trainings`, 'create', 'POST');

    trainings.forEach((training) => {
      response.addLink(
        `${baseUrl}/trainings/${training.id}`,
        `training_${training.id}`,
        'GET',
      );
    });

    return response;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar um treino por ID',
    description: 'Retorna um treino específico com base no ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do treino',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Treino encontrado com sucesso',
    type: TrainingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Treino não encontrado',
  })
  async findById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<HateoasResponse<Training>> {
    try {
      const training = await this.trainingService.findById(id);

      const response = new HateoasResponse(training);

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      response.addLink(`${baseUrl}/trainings/${id}`, 'self', 'GET');
      response.addLink(`${baseUrl}/trainings`, 'collection', 'GET');
      response.addLink(`${baseUrl}/trainings/${id}`, 'update', 'PUT');
      response.addLink(`${baseUrl}/trainings/${id}`, 'delete', 'DELETE');

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Criar um novo treino',
    description: 'Cria um novo treino com os dados fornecidos',
  })
  @ApiBody({
    type: CreateTrainingDto,
    description: 'Dados para criação do treino',
  })
  @ApiResponse({
    status: 201,
    description: 'Treino criado com sucesso',
    type: TrainingResponseDto,
  })
  async create(
    @Body() createTrainingDto: CreateTrainingDto,
    @Req() request: Request,
  ): Promise<HateoasResponse<Training>> {
    const training = await this.trainingService.create(createTrainingDto);

    const response = new HateoasResponse(training);

    const baseUrl = `${request.protocol}://${request.get('host')}`;

    response.addLink(`${baseUrl}/trainings/${training.id}`, 'self', 'GET');
    response.addLink(`${baseUrl}/trainings`, 'collection', 'GET');
    response.addLink(`${baseUrl}/trainings/${training.id}`, 'update', 'PUT');
    response.addLink(`${baseUrl}/trainings/${training.id}`, 'delete', 'DELETE');

    return response;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar um treino',
    description: 'Atualiza os dados de um treino existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do treino',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTrainingDto,
    description: 'Dados para atualização do treino',
  })
  @ApiResponse({
    status: 200,
    description: 'Treino atualizado com sucesso',
    type: TrainingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Treino não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTrainingDto: UpdateTrainingDto,
    @Req() request: Request,
  ): Promise<HateoasResponse<Training>> {
    try {
      const training = await this.trainingService.update(id, updateTrainingDto);

      const response = new HateoasResponse(training);

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      response.addLink(`${baseUrl}/trainings/${id}`, 'self', 'GET');
      response.addLink(`${baseUrl}/trainings`, 'collection', 'GET');
      response.addLink(`${baseUrl}/trainings/${id}`, 'update', 'PUT');
      response.addLink(`${baseUrl}/trainings/${id}`, 'delete', 'DELETE');

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir um treino',
    description: 'Exclui um treino com base no ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do treino',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Treino excluído com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        trainingId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        trainingTitle: {
          type: 'string',
          example: 'Treino Funcional',
          nullable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Treino não encontrado',
  })
  async delete(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<
    HateoasResponse<{
      success: boolean;
      trainingId: string;
      trainingTitle: string | null;
    }>
  > {
    try {
      const result = await this.trainingService.delete(id);

      const response = new HateoasResponse(result);

      const baseUrl = `${request.protocol}://${request.get('host')}`;

      response.addLink(`${baseUrl}/trainings`, 'collection', 'GET');
      response.addLink(`${baseUrl}/trainings`, 'create', 'POST');

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
