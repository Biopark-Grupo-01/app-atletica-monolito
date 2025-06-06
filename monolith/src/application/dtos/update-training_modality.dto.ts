import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateTrainingModalityDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;
}
