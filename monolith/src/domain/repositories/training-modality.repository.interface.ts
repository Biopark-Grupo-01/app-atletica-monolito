import { TrainingModality } from '../entities/training-modality.entity';
import { CreateTrainingModalityDto } from '../../application/dtos/create-training_modality.dto';
import { UpdateTrainingModalityDto } from '../../application/dtos/update-training_modality.dto';

export const MODALITY_REPOSITORY_TOKEN = Symbol('IModalityRepository');

export interface IModalityRepository {
  create(
    createModalityDto: CreateTrainingModalityDto,
  ): Promise<TrainingModality>;
  findAll(): Promise<TrainingModality[]>;
  findById(id: string): Promise<TrainingModality | null>;
  findByName(name: string): Promise<TrainingModality | null>;
  update(
    id: string,
    updateTrainingModalityDto: UpdateTrainingModalityDto,
  ): Promise<TrainingModality | null>;
  delete(id: string): Promise<boolean>;
}
