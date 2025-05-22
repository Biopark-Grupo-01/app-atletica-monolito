import { RoleResponseDto } from './role-response.dto';

export class UserResponseDto {
  id: string;
  name: string;
  registrationNumber: string;
  cpf: string;
  email: string;
  phone: string;
  role: RoleResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
