import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Training } from '../../../domain/entities/training.entity';
import { ITrainingRepository } from '../../../domain/repositories/training.repository.interface';
import {
  // CreateTrainingDto,
  UpdateTrainingDto,
} from '../../../application/dtos/training.dto';

@Injectable()
export class TypeOrmTrainingRepository implements ITrainingRepository {
  constructor(
    @InjectRepository(Training)
    private readonly ormRepository: Repository<Training>,
  ) {}

  async findAll(): Promise<Training[]> {
    return this.ormRepository.find();
  }

  async findById(id: string): Promise<Training | null> {
    return this.ormRepository.findOneBy({ id });
  }

  async create(training: Training): Promise<Training> {
    const newTraining = this.ormRepository.create(training);
    return this.ormRepository.save(newTraining);
  }

  async update(
    id: string,
    updateTrainingDto: UpdateTrainingDto,
  ): Promise<Training | null> {
    const existingTraining = await this.findById(id);
    if (!existingTraining) {
      return null;
    }
    const updatedTraining = this.ormRepository.merge(
      existingTraining,
      updateTrainingDto,
    );
    await this.ormRepository.save(updatedTraining);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
