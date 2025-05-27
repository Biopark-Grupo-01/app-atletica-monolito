import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingController } from '../presentation/controllers/training.controller';
import { TrainingService } from '../application/services/training.service';
import { TypeOrmTrainingRepository } from '../infrastructure/typeorm/repositories/typeorm-training.repository';
import { TRAINING_REPOSITORY_TOKEN } from '../domain/repositories/training.repository.interface';
import { Training } from '../domain/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training])],
  controllers: [TrainingController],
  providers: [
    TrainingService,
    {
      provide: TRAINING_REPOSITORY_TOKEN,
      useClass: TypeOrmTrainingRepository,
    },
  ],
  exports: [TrainingService, TRAINING_REPOSITORY_TOKEN],
})
export class TrainingModule {}
