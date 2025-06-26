import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from '@app/application/services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@app/application/dtos/user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '@app/infrastructure/guards/firebase-auth.guard';
import { HateoasService } from '@app/application/services/hateoas.service';
import { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hateoasService: HateoasService,
  ) {}

  private getBaseUrl(req: Request): string {
    return `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return this.hateoasService.addLinksToItem(
      user,
      this.getBaseUrl(req),
    ) as UserResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
    type: [UserResponseDto],
  })
  async findAll(@Req() req: Request): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    const usersWithLinks = this.hateoasService.addLinksToCollection(
      users,
      this.getBaseUrl(req),
    );
    // Add collection-level links
    return Object.assign(usersWithLinks, {
      _links: this.hateoasService.createLinksForCollection(
        this.getBaseUrl(req),
      ),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'The user.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return this.hateoasService.addLinksToItem(
      user,
      this.getBaseUrl(req),
    ) as UserResponseDto;
  }

  @Get('/email/:email')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiResponse({ status: 200, description: 'The user.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByEmail(
    @Param('email') email: string,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findByEmail(email);
    return this.hateoasService.addLinksToItem(
      user,
      this.getBaseUrl(req),
    ) as UserResponseDto;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(id, updateUserDto);
    return this.hateoasService.addLinksToItem(
      user,
      this.getBaseUrl(req),
    ) as UserResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
