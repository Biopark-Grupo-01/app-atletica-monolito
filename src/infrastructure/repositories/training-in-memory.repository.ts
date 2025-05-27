import { Injectable } from '@nestjs/common';
import { Training } from '../../domain/entities/training.entity';
import { TrainingRepository } from '../../domain/repositories/training.repository';

@Injectable()
export class TrainingInMemoryRepository implements TrainingRepository {
  private trainings: Training[] = [];

  async findAll(): Promise<Training[]> {
    return this.trainings.map((training) => new Training({ ...training }));
  }

  async findById(id: string): Promise<Training | null> {
    const training = this.trainings.find((t) => t.id === id);
    return training ? new Training({ ...training }) : null;
  }

  async create(training: Training): Promise<Training> {
    const newTraining = new Training({ ...training });
    this.trainings.push(newTraining);
    return new Training({ ...newTraining });
  }

  async update(
    id: string,
    trainingData: Partial<Training>,
  ): Promise<Training | null> {
    const index = this.trainings.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }

    const updatedTraining = new Training({
      ...this.trainings[index],
      ...trainingData,
      updated_at: new Date(),
    });

    this.trainings[index] = updatedTraining;
    return new Training({ ...updatedTraining });
  }

  async delete(
    id: string,
  ): Promise<{ success: boolean; training: Training | null }> {
    const training = await this.findById(id);

    if (!training) {
      return { success: false, training: null };
    }

    const initialLength = this.trainings.length;
    this.trainings = this.trainings.filter((t) => t.id !== id);
    const success = initialLength !== this.trainings.length;

    return {
      success,
      training,
    };
  }
}
