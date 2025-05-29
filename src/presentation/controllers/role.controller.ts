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
import { RoleService } from '../../application/services/role.service';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { UpdateRoleDto } from '../../application/dtos/update-role.dto';
import { RoleResponseDto } from '../../application/dtos/role-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';
import { Response } from 'express';
import { HateoasService } from '../../application/services/hateoas.service';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly hateoasService: HateoasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponse,
  })
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<RoleResponseDto>>> {
    try {
      const role = await this.roleService.create(createRoleDto);
      const responseDtoWithLinks = this.hateoasService.addLinksToItem(
        role,
        'roles',
      );
      return res
        .status(HttpStatus.CREATED)
        .json(
          new SuccessResponse<RoleResponseDto>(
            HttpStatus.CREATED,
            responseDtoWithLinks,
            'Role created successfully',
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            'Error creating role',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Return all roles.',
    type: SuccessResponse,
  })
  async findAll(
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<RoleResponseDto[]>>> {
    const roles = await this.roleService.findAll();
    const rolesWithLinks = this.hateoasService.addLinksToCollection(
      roles,
      'roles',
    );
    const collectionLinks =
      this.hateoasService.createLinksForCollection('roles');
    return res
      .status(HttpStatus.OK)
      .json(
        new SuccessResponse<RoleResponseDto[]>(
          HttpStatus.OK,
          rolesWithLinks,
          'Roles retrieved successfully',
          collectionLinks,
        ),
      );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the role.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found.',
    type: ErrorResponse,
  })
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<RoleResponseDto>>> {
    try {
      const role = await this.roleService.findOne(id);
      const responseDtoWithLinks = this.hateoasService.addLinksToItem(
        role,
        'roles',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<RoleResponseDto>(
            HttpStatus.OK,
            responseDtoWithLinks,
            'Role retrieved successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Error retrieving role',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found.',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<RoleResponseDto>>> {
    try {
      const role = await this.roleService.update(id, updateRoleDto);
      const responseDtoWithLinks = this.hateoasService.addLinksToItem(
        role,
        'roles',
      );
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<RoleResponseDto>(
            HttpStatus.OK,
            responseDtoWithLinks,
            'Role updated successfully',
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ErrorResponse(
            HttpStatus.BAD_REQUEST,
            'Error updating role',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully deleted.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found.',
    type: ErrorResponse,
  })
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<void>>> {
    try {
      await this.roleService.delete(id);
      const links: HateoasLinkDto[] =
        this.hateoasService.createLinksForCollection('roles');
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<void>(
            HttpStatus.OK,
            undefined,
            'Role deleted successfully',
            links,
          ),
        );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json(new ErrorResponse(HttpStatus.NOT_FOUND, error.message));
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Error deleting role',
            error.message as string,
            error.stack as string,
          ),
        );
    }
  }
}
