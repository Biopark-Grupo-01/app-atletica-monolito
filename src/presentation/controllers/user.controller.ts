import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';
import { Response } from 'express';
import { HateoasService } from '../../application/services/hateoas.service';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hateoasService: HateoasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponse,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<UserResponseDto>>> {
    try {
      const user = await this.userService.create(createUserDto);
      const userWithLinks = this.hateoasService.addLinksToItem(user, 'users');
      return res
        .status(HttpStatus.CREATED)
        .json(
          new SuccessResponse<UserResponseDto>(
            HttpStatus.CREATED,
            userWithLinks,
            'User created successfully',
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred creating user';
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: SuccessResponse,
  })
  async findAll(
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<UserResponseDto[]>>> {
    try {
      const users = await this.userService.findAll();
      const usersWithLinks = this.hateoasService.addLinksToCollection(
        users,
        'users',
      );
      const collectionLinks =
        this.hateoasService.createLinksForCollection('users');
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<UserResponseDto[]>(
            HttpStatus.OK,
            usersWithLinks,
            'Users retrieved successfully',
            collectionLinks,
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while retrieving users';
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorResponse,
  })
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<UserResponseDto>>> {
    try {
      const user = await this.userService.findOne(id);
      const userWithLinks = this.hateoasService.addLinksToItem(user, 'users');
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<UserResponseDto>(
            HttpStatus.OK,
            userWithLinks,
            'User retrieved successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred retrieving user';
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<UserResponseDto>>> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      const userWithLinks = this.hateoasService.addLinksToItem(user, 'users');
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<UserResponseDto>(
            HttpStatus.OK,
            userWithLinks,
            'User updated successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred updating user';
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorResponse,
  })
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<void>>> {
    try {
      await this.userService.delete(id);
      const links: HateoasLinkDto[] =
        this.hateoasService.createLinksForCollection('users');
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<void>(
            HttpStatus.OK,
            undefined,
            'User deleted successfully',
            links,
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred deleting user';
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }
}
