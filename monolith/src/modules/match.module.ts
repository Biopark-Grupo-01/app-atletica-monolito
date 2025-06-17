import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from '../presentation/controllers/match.controller';
import { MatchService } from '../application/services/match.service';
import { TypeOrmMatchRepository } from '../infrastructure/typeorm/repositories/typeorm-match.repository';
import { MATCH_REPOSITORY_TOKEN } from '../domain/repositories/match.repository.interface';
import { Match } from '../domain/entities/match.entity';
import { HateoasService } from '../application/services/hateoas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchController],
  providers: [
    MatchService,
    HateoasService,
    {
      provide: MATCH_REPOSITORY_TOKEN,
      useClass: TypeOrmMatchRepository,
    },
  ],
  exports: [MatchService, MATCH_REPOSITORY_TOKEN],
})
export class MatchModule {}
