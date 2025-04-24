import { Cargo } from '../entities/cargo';

export interface CargoRepository {
  create(cargo: Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cargo>;
  findAll(): Promise<Cargo[]>;
  findOne(id: string): Promise<Cargo | null>;
  update(
    id: string,
    cargo: Partial<Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Cargo>;
  delete(id: string): Promise<void>;
}
