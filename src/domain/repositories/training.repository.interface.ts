import { Training } from '../entities/training.entity';

export const TRAINING_REPOSITORY_TOKEN = Symbol('ITrainingRepository');

export interface ITrainingRepository {
  findAll(): Promise<Training[]>;
  findById(id: string): Promise<Training | null>;
  create(training: Training): Promise<Training>;
  update(id: string, training: Partial<Training>): Promise<Training | null>;
  delete(id: string): Promise<boolean>;
}
