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
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '@app/application/services/role.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto,
} from '@app/application/dtos/role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HateoasService } from '@app/application/services/hateoas.service';
import { Request } from 'express';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly hateoasService: HateoasService,
  ) {}

  private getBaseUrl(req: Request): string {
    return `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() req: Request,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.create(createRoleDto);
    return this.hateoasService.addLinksToItem(
      role,
      this.getBaseUrl(req),
    ) as RoleResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all roles.',
    type: [RoleResponseDto],
  })
  async findAll(@Req() req: Request): Promise<RoleResponseDto[]> {
    const roles = await this.roleService.findAll();
    const rolesWithLinks = this.hateoasService.addLinksToCollection(
      roles,
      this.getBaseUrl(req),
    );
    // Add collection-level links
    return Object.assign(rolesWithLinks, {
      _links: this.hateoasService.createLinksForCollection(
        this.getBaseUrl(req),
      ),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'The role.', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.findById(id);
    return this.hateoasService.addLinksToItem(
      role,
      this.getBaseUrl(req),
    ) as RoleResponseDto;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: Request,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.update(id, updateRoleDto);
    return this.hateoasService.addLinksToItem(
      role,
      this.getBaseUrl(req),
    ) as RoleResponseDto;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({
    status: 204,
    description: 'The role has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.roleService.delete(id);
  }
}
