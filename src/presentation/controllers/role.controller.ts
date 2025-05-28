import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { RoleService } from '../../application/services/role.service';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { RoleResponseDto } from '../../application/dtos/role-response.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    const role = await this.roleService.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: Partial<CreateRoleDto>,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.update(id, updateRoleDto);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const role = await this.roleService.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found.');
    }
    await this.roleService.delete(id);
  }
}
