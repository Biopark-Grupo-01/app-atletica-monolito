import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Training } from '../../domain/entities/training.entity';
import { TrainingRepository } from '../../domain/repositories/training.repository';

@Injectable()
export class TrainingPostgresRepository implements TrainingRepository {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
  ) {}

  async findAll(): Promise<Training[]> {
    return this.trainingRepository.find();
  }

  async findById(id: string): Promise<Training | null> {
    return this.trainingRepository.findOneBy({ id });
  }

  async create(training: Training): Promise<Training> {
    return this.trainingRepository.save(training);
  }

  async update(
    id: string,
    trainingData: Partial<Training>,
  ): Promise<Training | null> {
    await this.trainingRepository.update(id, trainingData);
    return this.findById(id);
  }

  async delete(
    id: string,
  ): Promise<{ success: boolean; training: Training | null }> {
    try {
      const training = await this.findById(id);

      if (!training) {
        return { success: false, training: null };
      }

      const result = await this.trainingRepository.delete(id);

      let success = false;
      if (result && typeof result === 'object') {
        if ('affected' in result && result.affected !== undefined) {
          success = result.affected !== null && result.affected > 0;
        }
        if ('raw' in result && result.raw !== undefined) {
          success = result.raw.affectedRows > 0;
        }
      }

      return {
        success,
        training,
      };
    } catch (error) {
      console.error('Error deleting training:', error);
      return { success: false, training: null };
    }
  }
}
