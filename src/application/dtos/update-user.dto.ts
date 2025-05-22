import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUUID,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Phone must be in format (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
  })
  phone?: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;
}
