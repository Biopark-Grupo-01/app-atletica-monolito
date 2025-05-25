export class CreateTrainingDto {
  title: string;
  description: string;
  modality: string;
  place: string;
  start_date: string;
  start_time: string;
  coach: string;
  responsible: string;
}

export class UpdateTrainingDto {
  title?: string;
  description?: string;
  modality?: string;
  place?: string;
  start_date?: string;
  start_time?: string;
  coach?: string;
  responsible?: string;
}

export class TrainingResponseDto {
  id: number;
  title: string;
  description: string;
  modality: string;
  place: string;
  start_date: string;
  start_time: string;
  coach: string;
  responsible: string;
  created_at: Date;
  updated_at: Date;
}
