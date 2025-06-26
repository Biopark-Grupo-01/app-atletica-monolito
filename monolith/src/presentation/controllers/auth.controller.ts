import {
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
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
    fullName?: string;
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

  private async findOrCreateUser(
    firebaseUser: FirebaseUser['user'],
    createUserDto?: Partial<CreateUserDto>,
  ): Promise<UserResponseDto> {
    let user = await this.userService.findByFirebaseUid(firebaseUser.uid);

    if (!user) {
      const newUserDto: CreateUserDto = {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email!,
        name:
          createUserDto?.name ||
          firebaseUser.fullName ||
          firebaseUser.name ||
          firebaseUser.email!.split('@')[0],
        profilePicture: createUserDto?.profilePicture || firebaseUser.picture,
        ...createUserDto,
      };
      user = await this.userService.create(newUserDto);
    }

    return user;
  }

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
    const user = await this.findOrCreateUser(req.user);
    const baseUrl = `${req.protocol}://${req.get('host')}/api`;
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
    const user = await this.findOrCreateUser(req.user);
    const baseUrl = `${req.protocol}://${req.get('host')}/api`;
    return this.hateoasService.addLinksToItem(user, `${baseUrl}/users`);
  }

  @Post('signup')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a local user profile after Firebase registration',
  })
  @ApiResponse({
    status: 201,
    description: 'User profile successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid Firebase token.',
  })
  async signUp(
    @Req() req: FirebaseUser,
    @Body() createUserDto: Partial<CreateUserDto>,
  ): Promise<UserResponseDto> {
    const user = await this.findOrCreateUser(req.user, createUserDto);
    const baseUrl = `${req.protocol}://${req.get('host')}/api`;
    return this.hateoasService.addLinksToItem(user, `${baseUrl}/users`);
  }
}
