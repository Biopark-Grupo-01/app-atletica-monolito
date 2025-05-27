import { RoleResponseDto } from './role-response.dto';

export class UserResponseDto {
  id: string;
  name: string;
  registrationNumber?: string;
  cpf?: string;
  email: string;
  phone?: string;
  role: RoleResponseDto; // Role is expected to be populated
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  profilePictureUrl?: string;
  fcmToken?: string;
}
