import { CargoResponseDto } from './cargo-response.dto';

export class UserResponseDto {
  id: string;
  name: string;
  registrationNumber: string;
  cpf: string;
  email: string;
  phone: string;
  cargo: CargoResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
