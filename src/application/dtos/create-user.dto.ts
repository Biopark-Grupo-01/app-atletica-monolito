import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsUUID,
  Matches,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF must be in format XXX.XXX.XXX-XX',
  })
  @MaxLength(14)
  cpf?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8) // Consider a stronger password policy
  @MaxLength(100)
  password?: string;

  @IsOptional() // Made phone optional
  @IsString()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Phone must be in format (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
  })
  @MaxLength(15)
  phone?: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;

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
  @MaxLength(1024) // FCM tokens can be long
  fcmToken?: string;
}
