import { Training } from '../entities/training.entity';

export const TRAINING_REPOSITORY = 'TRAINING_REPOSITORY';

export interface TrainingRepository {
  findAll(): Promise<Training[]>;
  findById(id: string): Promise<Training | null>;
  create(training: Training): Promise<Training>;
  update(id: string, training: Partial<Training>): Promise<Training | null>;
  delete(id: string): Promise<{ success: boolean; training: Training | null }>;
}
