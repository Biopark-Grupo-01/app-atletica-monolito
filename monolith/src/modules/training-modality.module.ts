import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingModalityController } from '../presentation/controllers/training-modality.controller';
import { TrainingModalityService } from '../application/services/training-modality.service';
import { TypeOrmTrainingModalityRepository } from '../infrastructure/typeorm/repositories/typeorm-training_modality.repository';
import { MODALITY_REPOSITORY_TOKEN } from '../domain/repositories/training-modality.repository.interface';
import { TrainingModality } from '../domain/entities/training-modality.entity';
import { HateoasService } from '@app/application/services/hateoas.service';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingModality])],
  controllers: [TrainingModalityController],
  providers: [
    TrainingModalityService,
    {
      provide: MODALITY_REPOSITORY_TOKEN,
      useClass: TypeOrmTrainingModalityRepository,
    },
    HateoasService,
  ],
  exports: [TrainingModalityService, MODALITY_REPOSITORY_TOKEN],
})
export class TrainingModalityModule {}
