import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must have at least 3 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Registration number is required' })
  registrationNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF is required' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'Invalid CPF format. Use: XXX.XXX.XXX-XX',
  })
  cpf: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^\(\d{2}\)\s\d{4,5}\-\d{4}$/, {
    message: 'Invalid phone format. Use: (XX) XXXXX-XXXX',
  })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Cargo ID is required' })
  cargoId: string;
}
