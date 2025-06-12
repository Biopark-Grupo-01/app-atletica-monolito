import { Injectable, ConflictException, Inject } from '@nestjs/common';
import {
  ITrainingUserRepository,
  TRAINING_USER_REPOSITORY_TOKEN,
} from '@app/domain/repositories/training-user.repository.interface';
import { TrainingUser } from '@app/domain/entities/training-user.entity';

@Injectable()
export class TrainingUserService {
  constructor(
    @Inject(TRAINING_USER_REPOSITORY_TOKEN)
    private readonly trainingUserRepository: ITrainingUserRepository,
  ) {}

  async findAll(userId?: string): Promise<TrainingUser[]> {
    return this.trainingUserRepository.findAll(userId);
  }

  async isUserSubscribed(userId: string, trainingId: string): Promise<boolean> {
    return this.trainingUserRepository.isUserSubscribed(userId, trainingId);
  }

  async subscribe(userId: string, trainingId: string): Promise<TrainingUser> {
    const alreadySubscribed =
      await this.trainingUserRepository.isUserSubscribed(userId, trainingId);
    if (alreadySubscribed) {
      throw new ConflictException('Usuário já inscrito neste treino');
    }

    return this.trainingUserRepository.subscribe(userId, trainingId);
  }
}
