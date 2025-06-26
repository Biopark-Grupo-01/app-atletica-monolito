import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingUser } from '../../../domain/entities/training-user.entity';
import { ITrainingUserRepository } from '../../../domain/repositories/training-user.repository.interface';

@Injectable()
export class TypeOrmTrainingUserRepository implements ITrainingUserRepository {
  constructor(
    @InjectRepository(TrainingUser)
    private readonly ormRepository: Repository<TrainingUser>,
  ) {}

  async findAll(userId?: string): Promise<TrainingUser[]> {
    if (userId) {
      return this.ormRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'training'],
      });
    }

    return this.ormRepository.find({
      relations: ['user', 'training'],
    });
  }

  async isUserSubscribed(userId: string, trainingId: string): Promise<boolean> {
    const existing = await this.ormRepository.findOne({
      where: {
        user: { id: userId },
        training: { id: trainingId },
      },
    });
    return !!existing;
  }

  async subscribe(userId: string, trainingId: string): Promise<TrainingUser> {
    const subscription = this.ormRepository.create({
      user: { id: userId },
      training: { id: trainingId },
    });
    return this.ormRepository.save(subscription);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
