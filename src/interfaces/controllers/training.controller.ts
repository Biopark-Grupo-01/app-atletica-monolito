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
} from '@nestjs/common';
import { TrainingService } from '../../application/services/training.service';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
} from '../../application/dtos/training.dto';
import { Training } from '../../domain/entities/training.entity';

@Controller('trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  async findAll(): Promise<Training[]> {
    return this.trainingService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Training> {
    try {
      return await this.trainingService.findById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  async create(
    @Body() createTrainingDto: CreateTrainingDto,
  ): Promise<Training> {
    return this.trainingService.create(createTrainingDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrainingDto: UpdateTrainingDto,
  ): Promise<Training> {
    try {
      return await this.trainingService.update(id, updateTrainingDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{
    success: boolean;
    trainingId: string;
    trainingTitle: string | null;
  }> {
    try {
      const result = await this.trainingService.delete(id);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
