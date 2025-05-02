import { Cargo } from '../entities/cargo';

export interface CargoRepository {
  create(cargo: { name: string; description?: string }): Promise<Cargo>;
  findAll(): Promise<Cargo[]>;
  findOne(id: string): Promise<Cargo | null>;
  update(
    id: string,
    cargo: Partial<{ name: string; description?: string }>,
  ): Promise<Cargo>;
  delete(id: string): Promise<void>;
}
