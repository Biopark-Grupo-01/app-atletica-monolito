import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  IMatchRepository,
  MATCH_REPOSITORY_TOKEN,
} from '../../domain/repositories/match.repository.interface';
import { Match } from '../../domain/entities/match.entity';
import { CreateMatchDto } from '../dtos/create-match.dto';

@Injectable()
export class MatchService {
  constructor(
    @Inject(MATCH_REPOSITORY_TOKEN)
    private readonly matchRepository: IMatchRepository,
  ) {}

  async findAll(): Promise<Match[]> {
    return this.matchRepository.findAll();
  }

  async findById(id: string): Promise<Match> {
    const match = await this.matchRepository.findById(id);
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchRepository.create(createMatchDto);
  }

  async update(id: string, updateMatchDto: Partial<Match>): Promise<Match> {
    const match = await this.matchRepository.update(id, updateMatchDto);
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  async delete(id: string): Promise<void> {
    const success = await this.matchRepository.delete(id);
    if (!success) {
      throw new NotFoundException(`Match with ID ${id} could not be deleted.`);
    }
  }
}
