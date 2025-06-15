import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TrainingUserService } from '@app/application/services/training-user.service';
import { CreateTrainingUserDto } from '@app/application/dtos/training-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse as CustomApiResponse,
} from '../../interfaces/http/response.interface';
import { Response } from 'express';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class TrainingUserController {
  constructor(private readonly trainingUserService: TrainingUserService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
  ): Promise<{ message: string; data: any[] }> {
    const subscriptions = await this.trainingUserService.findAll(userId);
    return {
      message: 'Lista de inscrições',
      data: subscriptions,
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Subscribe user to a training',
    description: 'Creates a subscription for a user in a training session.',
  })
  @ApiBody({
    type: CreateTrainingUserDto,
    description: 'User and training identifiers.',
  })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully.',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 409,
    description: 'User is already subscribed.',
    type: ErrorResponse,
  })
  async subscribe(
    @Body() createDto: CreateTrainingUserDto,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<any>>> {
    try {
      const alreadySubscribed = await this.trainingUserService.isUserSubscribed(
        createDto.userId,
        createDto.trainingId,
      );

      if (alreadySubscribed) {
        return res
          .status(HttpStatus.CONFLICT)
          .json(
            new ErrorResponse(
              HttpStatus.CONFLICT,
              'Usuário já inscrito neste treino',
            ),
          );
      }

      const subscription = await this.trainingUserService.subscribe(
        createDto.userId,
        createDto.trainingId,
      );

      return res
        .status(HttpStatus.CREATED)
        .json(
          new SuccessResponse(
            HttpStatus.CREATED,
            subscription,
            'Inscrição realizada com sucesso',
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Erro ao processar a inscrição',
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<CustomApiResponse<void>>> {
    try {
      await this.trainingUserService.delete(id);
      return res
        .status(HttpStatus.OK)
        .json(
          new SuccessResponse<void>(
            HttpStatus.OK,
            undefined,
            'Inscrição removida com sucesso',
          ),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Erro ao remover inscrição',
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }
}
