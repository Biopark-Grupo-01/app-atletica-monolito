import { Request } from 'express';
import { UserResponseDto } from '@app/application/dtos/user.dto';

export interface AuthenticatedRequest extends Request {
  user: UserResponseDto;
}
