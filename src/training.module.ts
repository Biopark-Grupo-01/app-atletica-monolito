import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingController } from './interfaces/controllers/training.controller';
import { TrainingService } from './application/services/training.service';
import { TRAINING_REPOSITORY } from './domain/repositories/training.repository';
import { TrainingPostgresRepository } from './infrastructure/repositories/training-postgres.repository';
import { Training } from './domain/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training])],
  controllers: [TrainingController],
  providers: [
    TrainingService,
    {
      provide: TRAINING_REPOSITORY,
      useClass: TrainingPostgresRepository,
    },
  ],
  exports: [TrainingService],
})
export class TrainingModule {}
