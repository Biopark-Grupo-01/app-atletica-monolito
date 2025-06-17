import { Match } from '../entities/match.entity';
import { CreateMatchDto } from '../../application/dtos/create-match.dto';

export const MATCH_REPOSITORY_TOKEN = Symbol('IMatchRepository');

export interface IMatchRepository {
  findAll(): Promise<Match[]>;
  findById(id: string): Promise<Match | null>;
  create(createMatchDto: CreateMatchDto): Promise<Match>;
  update(id: string, updateMatchDto: Partial<Match>): Promise<Match | null>;
  delete(id: string): Promise<boolean>;
}
