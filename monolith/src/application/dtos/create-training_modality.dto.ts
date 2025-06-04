import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTrainingModalityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
