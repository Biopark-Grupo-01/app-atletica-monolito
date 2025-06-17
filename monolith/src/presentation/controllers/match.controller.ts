import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { MatchService } from '../../application/services/match.service';
import { CreateMatchDto } from '../../application/dtos/create-match.dto';
import { MatchResponseDto } from '../../application/dtos/match-response.dto';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';

@ApiTags('Matches')
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @ApiOperation({ summary: 'List all matches' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  async findAll(
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<MatchResponseDto[]>>> {
    const matches = await this.matchService.findAll();
    return res
      .status(HttpStatus.OK)
      .json(
        new SuccessResponse(
          HttpStatus.OK,
          matches,
          'Matches retrieved successfully',
        ),
      );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match by ID' })
  @ApiParam({ name: 'id', description: 'Match ID' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async findById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<MatchResponseDto>>> {
    try {
      const match = await this.matchService.findById(id);
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(
            HttpStatus.OK,
            match,
            'Match retrieved successfully',
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Error retrieving match';
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

  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiBody({ type: CreateMatchDto })
  @ApiResponse({ status: 201, type: SuccessResponse })
  async create(
    @Body() dto: CreateMatchDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<MatchResponseDto>>> {
    const match = await this.matchService.create(dto);
    return res
      .status(HttpStatus.CREATED)
      .json(
        new SuccessResponse(
          HttpStatus.CREATED,
          match,
          'Match created successfully',
        ),
      );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a match' })
  @ApiParam({ name: 'id', description: 'Match ID' })
  @ApiBody({ type: CreateMatchDto })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateMatchDto>,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<MatchResponseDto>>> {
    try {
      const match = await this.matchService.update(id, dto);
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(
            HttpStatus.OK,
            match,
            'Match updated successfully',
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Error updating match';
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a match' })
  @ApiParam({ name: 'id', description: 'Match ID' })
  @ApiResponse({ status: 200, type: SuccessResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<void>>> {
    try {
      await this.matchService.delete(id);
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse(
            HttpStatus.OK,
            undefined,
            'Match deleted successfully',
          ),
        );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Error deleting match';
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
