import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingUserController } from '@app/presentation/controllers/training-user.controller';
import { TrainingUserService } from '@app/application/services/training-user.service';
import { TypeOrmTrainingUserRepository } from '@app/infrastructure/typeorm/repositories/typeorm-training-user.repository';
import { TrainingUser } from '@app/domain/entities/training-user.entity';
import {
  TRAINING_USER_REPOSITORY_TOKEN,
  // ITrainingUserRepository,
} from '@app/domain/repositories/training-user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingUser])],
  controllers: [TrainingUserController],
  providers: [
    TrainingUserService,
    {
      provide: TRAINING_USER_REPOSITORY_TOKEN,
      useClass: TypeOrmTrainingUserRepository,
    },
  ],
  exports: [TrainingUserService, TRAINING_USER_REPOSITORY_TOKEN],
})
export class TrainingUserModule {}
