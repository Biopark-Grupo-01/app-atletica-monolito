import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUUID,
  Matches,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  registrationNumber?: string;

  // CPF is typically not updatable, but if it is, add validation
  // @IsOptional()
  // @IsString()
  // @Matches(/^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$/, {
  //   message: 'CPF must be in format XXX.XXX.XXX-XX',
  // })
  // @MaxLength(14)
  // cpf?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}$/, {
    message: 'Phone must be in format (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
  })
  @MaxLength(15)
  phone?: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  googleId?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  profilePictureUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  fcmToken?: string;
}
