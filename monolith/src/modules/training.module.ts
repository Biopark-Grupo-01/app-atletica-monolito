import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingController } from '../presentation/controllers/training.controller';
import { TrainingService } from '../application/services/training.service';
import { TypeOrmTrainingRepository } from '../infrastructure/typeorm/repositories/typeorm-training.repository';
import { TRAINING_REPOSITORY_TOKEN } from '../domain/repositories/training.repository.interface';
import { Training } from '../domain/entities/training.entity';
import { TrainingModality } from '../domain/entities/training-modality.entity';
import { HateoasService } from '../application/services/hateoas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingModality])],
  controllers: [TrainingController],
  providers: [
    TrainingService,
    HateoasService,
    {
      provide: TRAINING_REPOSITORY_TOKEN,
      useClass: TypeOrmTrainingRepository,
    },
  ],
  exports: [TrainingService, TRAINING_REPOSITORY_TOKEN],
})
export class TrainingModule {}
