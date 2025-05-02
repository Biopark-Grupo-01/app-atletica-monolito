import { Injectable } from '@nestjs/common';
import { CreateCargoDto } from '../dtos/create-cargo.dto';
import { CargoResponseDto } from '../dtos/cargo-response.dto';
import { CargoRepository } from '../../domain/repositories/cargo-repository';
import { Cargo } from '../../domain/entities/cargo';

@Injectable()
export class CargoService {
  constructor(private readonly cargoRepository: CargoRepository) {}

  async create(createCargoDto: CreateCargoDto): Promise<CargoResponseDto> {
    const cargo = await this.cargoRepository.create({
      name: createCargoDto.nome,
      description: createCargoDto.descricao,
    });

    return this.toResponseDto(cargo);
  }

  async findAll(): Promise<CargoResponseDto[]> {
    const cargos = await this.cargoRepository.findAll();
    return cargos.map(this.toResponseDto);
  }

  async findOne(id: string): Promise<CargoResponseDto | null> {
    const cargo = await this.cargoRepository.findOne(id);

    if (!cargo) {
      return null;
    }

    return this.toResponseDto(cargo);
  }

  async update(
    id: string,
    updateData: Partial<CreateCargoDto>,
  ): Promise<CargoResponseDto> {
    const cargo = await this.cargoRepository.update(id, {
      name: updateData.nome,
      description: updateData.descricao,
    });
    return this.toResponseDto(cargo);
  }

  async delete(id: string): Promise<void> {
    await this.cargoRepository.delete(id);
  }

  private toResponseDto(cargo: Cargo): CargoResponseDto {
    return {
      id: cargo.getId(),
      nome: cargo.getName(),
      descricao: cargo.getDescription(),
      createdAt: cargo.getCreatedAt(),
      updatedAt: cargo.getUpdatedAt(),
    };
  }
}
