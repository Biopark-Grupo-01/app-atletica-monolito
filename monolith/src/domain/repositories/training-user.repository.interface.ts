import { TrainingUser } from '../entities/training-user.entity';

export const TRAINING_USER_REPOSITORY_TOKEN = Symbol('ITrainingUserRepository');

export interface ITrainingUserRepository {
  findAll(userId?: string): Promise<TrainingUser[]>; // <- modificado aqui
  isUserSubscribed(userId: string, trainingId: string): Promise<boolean>;
  subscribe(userId: string, trainingId: string): Promise<TrainingUser>;
  delete(id: string): Promise<boolean>;
}
