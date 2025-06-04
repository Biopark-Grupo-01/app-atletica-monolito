import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  IModalityRepository,
  MODALITY_REPOSITORY_TOKEN,
} from '../../domain/repositories/training-modality.repository.interface';
import { TrainingModality } from '../../domain/entities/training-modality.entity';
import { CreateTrainingModalityDto } from '../dtos/create-training_modality.dto';
import { UpdateTrainingModalityDto } from '../dtos/update-training_modality.dto';
import { TrainingModalityResponseDto } from '../dtos/training_modality-response.dto';

@Injectable()
export class TrainingModalityService {
  constructor(
    @Inject(MODALITY_REPOSITORY_TOKEN)
    private readonly modalityRepository: IModalityRepository,
  ) {}

  private mapToResponseDto(
    modality: TrainingModality,
  ): TrainingModalityResponseDto {
    return {
      id: modality.id,
      name: modality.name,
      createdAt: modality.createdAt,
      updatedAt: modality.updatedAt,
    };
  }

  private mapArrayToResponseDto(
    modalities: TrainingModality[],
  ): TrainingModalityResponseDto[] {
    return modalities.map((modality) => this.mapToResponseDto(modality));
  }

  async create(
    createModalityDto: CreateTrainingModalityDto,
  ): Promise<TrainingModalityResponseDto> {
    const existingModality = await this.modalityRepository.findByName(
      createModalityDto.name,
    );
    if (existingModality) {
      throw new ConflictException(
        `Modality with name '${createModalityDto.name}' already exists.`,
      );
    }

    const newModality = await this.modalityRepository.create(createModalityDto);
    return this.mapToResponseDto(newModality);
  }

  async findAll(): Promise<TrainingModalityResponseDto[]> {
    const modalities = await this.modalityRepository.findAll();
    return this.mapArrayToResponseDto(modalities);
  }

  async findOne(id: string): Promise<TrainingModalityResponseDto> {
    const modality = await this.modalityRepository.findById(id);
    if (!modality) {
      throw new NotFoundException(`Modality with ID '${id}' not found.`);
    }
    return this.mapToResponseDto(modality);
  }

  async update(
    id: string,
    updateModalityDto: UpdateTrainingModalityDto,
  ): Promise<TrainingModalityResponseDto> {
    const modalityToUpdate = await this.modalityRepository.findById(id);
    if (!modalityToUpdate) {
      throw new NotFoundException(`Modality with ID '${id}' not found.`);
    }

    if (
      updateModalityDto.name &&
      updateModalityDto.name !== modalityToUpdate.name
    ) {
      const existingModalityWithName = await this.modalityRepository.findByName(
        updateModalityDto.name,
      );
      if (existingModalityWithName && existingModalityWithName.id !== id) {
        throw new ConflictException(
          `Modality name '${updateModalityDto.name}' is already in use.`,
        );
      }
    }

    const dtoToUpdate: UpdateTrainingModalityDto = {};
    if (Object.prototype.hasOwnProperty.call(updateModalityDto, 'name'))
      dtoToUpdate.name = updateModalityDto.name;

    if (Object.keys(dtoToUpdate).length === 0) {
      return this.mapToResponseDto(modalityToUpdate);
    }

    const updatedModality = await this.modalityRepository.update(
      id,
      dtoToUpdate,
    );
    if (!updatedModality) {
      throw new NotFoundException(
        `Modality with ID '${id}' not found during update operation.`,
      );
    }
    return this.mapToResponseDto(updatedModality);
  }

  async delete(id: string): Promise<void> {
    const success = await this.modalityRepository.delete(id);
    if (!success) {
      throw new BadRequestException(
        `Modality with ID ${id} could not be deleted.`,
      );
    }
  }
}
