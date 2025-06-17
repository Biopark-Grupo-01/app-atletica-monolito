import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../../domain/entities/match.entity';
import { IMatchRepository } from '../../../domain/repositories/match.repository.interface';
import { CreateMatchDto } from '../../../application/dtos/create-match.dto';

@Injectable()
export class TypeOrmMatchRepository implements IMatchRepository {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async findAll(): Promise<Match[]> {
    return this.matchRepository.find({ relations: ['trainingModality'] });
  }

  async findById(id: string): Promise<Match | null> {
    return this.matchRepository.findOne({
      where: { id },
      relations: ['trainingModality'],
    });
  }

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const match = this.matchRepository.create(createMatchDto);
    return this.matchRepository.save(match);
  }

  async update(
    id: string,
    updateMatchDto: Partial<Match>,
  ): Promise<Match | null> {
    await this.matchRepository.update(id, updateMatchDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.matchRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
