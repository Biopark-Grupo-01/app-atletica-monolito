import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Training } from '../../domain/entities/training.entity';
import {
  TrainingRepository,
  TRAINING_REPOSITORY,
} from '../../domain/repositories/training.repository';
import { CreateTrainingDto, UpdateTrainingDto } from '../dtos/training.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrainingService {
  constructor(
    @Inject(TRAINING_REPOSITORY)
    private trainingRepository: TrainingRepository,
  ) {}

  async findAll(): Promise<Training[]> {
    return this.trainingRepository.findAll();
  }

  async findById(id: string): Promise<Training> {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }
    return training;
  }

  async create(createTrainingDto: CreateTrainingDto): Promise<Training> {
    const training = new Training({
      id: uuidv4(),
      ...createTrainingDto,
    });

    return this.trainingRepository.create(training);
  }

  async update(
    id: string,
    updateTrainingDto: UpdateTrainingDto,
  ): Promise<Training> {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    const updatedTraining = await this.trainingRepository.update(
      id,
      updateTrainingDto,
    );
    if (!updatedTraining) {
      throw new NotFoundException(`Failed to update training with ID ${id}`);
    }

    return updatedTraining;
  }

  async delete(id: string): Promise<{
    success: boolean;
    trainingId: string;
    trainingTitle: string | null;
  }> {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    const result = await this.trainingRepository.delete(id);
    return {
      success: result.success,
      trainingId: id,
      trainingTitle: result.training?.title || null,
    };
  }
}
