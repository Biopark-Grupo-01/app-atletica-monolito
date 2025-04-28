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
import { CargoService } from '../../application/services/cargo.service';
import { CreateCargoDto } from '../../application/dtos/create-cargo.dto';
import { CargoResponseDto } from '../../application/dtos/cargo-response.dto';

@Controller('cargos')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Post()
  async create(
    @Body() createCargoDto: CreateCargoDto,
  ): Promise<CargoResponseDto> {
    return this.cargoService.create(createCargoDto);
  }

  @Get()
  async findAll(): Promise<CargoResponseDto[]> {
    return this.cargoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CargoResponseDto> {
    const cargo = await this.cargoService.findOne(id);
    if (!cargo) {
      throw new NotFoundException('Cargo not found');
    }
    return cargo;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCargoDto: Partial<CreateCargoDto>,
  ): Promise<CargoResponseDto> {
    const cargo = await this.cargoService.update(id, updateCargoDto);
    if (!cargo) {
      throw new NotFoundException('Cargo not found');
    }
    return cargo;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const cargo = await this.cargoService.findOne(id);
    if (!cargo) {
      throw new NotFoundException('Cargo not found');
    }
    await this.cargoService.delete(id);
  }
}
