import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingModality } from '../../../domain/entities/training-modality.entity';
import { IModalityRepository } from '../../../domain/repositories/training-modality.repository.interface';
import { CreateTrainingModalityDto } from '../../../application/dtos/create-training_modality.dto';
import { UpdateTrainingModalityDto } from '../../../application/dtos/update-training_modality.dto';

@Injectable()
export class TypeOrmTrainingModalityRepository implements IModalityRepository {
  constructor(
    @InjectRepository(TrainingModality)
    private readonly trainingModalityRepository: Repository<TrainingModality>,
  ) {}

  async create(
    createTrainingModalityDto: CreateTrainingModalityDto,
  ): Promise<TrainingModality> {
    const newTrainingModality = this.trainingModalityRepository.create(
      createTrainingModalityDto,
    );
    return this.trainingModalityRepository.save(newTrainingModality);
  }

  async findAll(): Promise<TrainingModality[]> {
    return this.trainingModalityRepository.find();
  }

  async findById(id: string): Promise<TrainingModality | null> {
    return this.trainingModalityRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<TrainingModality | null> {
    return this.trainingModalityRepository.findOneBy({ name });
  }

  async update(
    id: string,
    updateTrainingModalityDto: UpdateTrainingModalityDto,
  ): Promise<TrainingModality | null> {
    await this.trainingModalityRepository.update(id, updateTrainingModalityDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.trainingModalityRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
