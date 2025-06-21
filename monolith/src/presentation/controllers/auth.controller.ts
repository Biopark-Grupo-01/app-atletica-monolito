import {
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '@app/application/services/user.service';
import { CreateUserDto, UserResponseDto } from '@app/application/dtos/user.dto';
import { HateoasService } from '@app/application/services/hateoas.service';
import { FirebaseAuthGuard } from '@infrastructure/guards/firebase-auth.guard';
import { Request } from 'express';

interface FirebaseUser extends Request {
  user: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly hateoasService: HateoasService,
  ) {}

  @Post('login/google')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Google via Firebase' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in or created.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async googleLogin(@Req() req: FirebaseUser): Promise<UserResponseDto> {
    const firebaseUser = req.user;
    let user = await this.userService.findByFirebaseUid(firebaseUser.uid);

    if (!user) {
      const createUserDto: CreateUserDto = {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.name || 'User',
        profilePicture: firebaseUser.picture,
      };
      user = await this.userService.create(createUserDto);
    }
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('/').slice(0, -2).join('/')}`;
    return this.hateoasService.addLinksToItem(user, `${baseUrl}/users`);
  }

  @Post('login/email')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Email/Password via Firebase' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in or created.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async emailLogin(@Req() req: FirebaseUser): Promise<UserResponseDto> {
    const firebaseUser = req.user;
    let user = await this.userService.findByFirebaseUid(firebaseUser.uid);

    if (!user) {
      const createUserDto: CreateUserDto = {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.name || firebaseUser.email!.split('@')[0],
      };
      user = await this.userService.create(createUserDto);
    }
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('/').slice(0, -2).join('/')}`;
    return this.hateoasService.addLinksToItem(user, `${baseUrl}/users`);
  }
}
