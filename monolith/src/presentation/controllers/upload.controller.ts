import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SuccessResponse } from 'src/interfaces/http/response.interface';
import * as fs from 'fs';
import * as path from 'path';

interface UploadedFileData {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @Post('news-image')
  @ApiOperation({ summary: 'Upload image for news' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPG, JPEG, PNG, GIF)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Image uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            filename: { type: 'string', example: 'news-uuid-123.jpg' },
            url: { type: 'string', example: '/uploads/news/news-uuid-123.jpg' },
            size: { type: 'number', example: 1024768 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid file type or no file uploaded',
  })
  @UseInterceptors(
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (
          req: any,
          file: any,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          const uploadPath = './uploads/news';
          console.log('📁 Definindo destino:', uploadPath);
          console.log('📂 Pasta existe:', fs.existsSync(uploadPath));

          // Garantir que a pasta existe
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('✅ Pasta criada:', uploadPath);
          }

          cb(null, uploadPath);
        },
        filename: (
          _req: any,
          file: any,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          try {
            const uniqueId = uuidv4();
            const extension = extname(String(file.originalname || ''));
            const filename = `news-${uniqueId}${extension}`;

            console.log('📝 Criando arquivo:', filename);
            console.log('🗂️ Extensão detectada:', extension);
            console.log('📄 Nome original:', file.originalname);

            cb(null, filename);
          } catch (error) {
            console.log('❌ Erro ao gerar filename:', error);
            cb(error as Error, '');
          }
        },
      }),
      fileFilter: (
        _req: any,
        file: any,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const allowedTypes = /\/(jpg|jpeg|png|gif)$/;
        if (!file.mimetype?.match(allowedTypes)) {
          cb(
            new BadRequestException(
              'Only image files (JPG, JPEG, PNG, GIF) are allowed!',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  )
  uploadNewsImage(@UploadedFile() file: UploadedFileData | undefined) {
    console.log('🔍 Upload Debug - Arquivo recebido:', file);

    if (!file) {
      console.log('❌ Nenhum arquivo enviado');
      throw new BadRequestException('No file uploaded');
    }

    // Verificar se o arquivo foi realmente salvo
    const filePath = path.join('./uploads/news', file.filename || '');
    const absolutePath = path.resolve(filePath);
    const fileExists = fs.existsSync(absolutePath);

    console.log('📁 Caminho do arquivo:', absolutePath);
    console.log('✅ Arquivo existe fisicamente:', fileExists);

    if (fileExists) {
      const stats = fs.statSync(absolutePath);
      console.log('📊 Tamanho do arquivo salvo:', stats.size, 'bytes');
    }

    if (!fileExists) {
      console.log('❌ ERRO: Arquivo não foi salvo fisicamente!');
      throw new BadRequestException('File was not saved successfully');
    }

    const imageData = {
      filename: file.filename || '',
      url: `/uploads/news/${file.filename || ''}`,
      size: file.size || 0,
    };

    console.log('📤 Resposta enviada:', imageData);

    return new SuccessResponse(
      HttpStatus.CREATED,
      imageData,
      'Image uploaded successfully',
    );
  }

  @Post('event-image')
  @ApiOperation({ summary: 'Upload event image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Event image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, GIF, WebP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Event image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Image uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            filename: { type: 'string', example: 'event-uuid-123.jpg' },
            url: {
              type: 'string',
              example: '/uploads/events/event-uuid-123.jpg',
            },
            size: { type: 'number', example: 1024768 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid file type or no file uploaded',
  })
  @UseInterceptors(
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (
          req: any,
          file: any,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          const uploadPath = './uploads/events';
          console.log('📁 Definindo destino (evento):', uploadPath);
          console.log('📂 Pasta existe:', fs.existsSync(uploadPath));

          // Garantir que a pasta existe
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('✅ Pasta criada:', uploadPath);
          }

          cb(null, uploadPath);
        },
        filename: (
          _req: any,
          file: any,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          try {
            const uniqueId = uuidv4();
            const ext = path.extname(file.originalname);
            const filename = `event-${uniqueId}${ext}`;

            console.log('📝 Criando arquivo (evento):', filename);
            console.log('🗂️ Extensão detectada:', ext);
            console.log('📄 Nome original:', file.originalname);

            cb(null, filename);
          } catch (error) {
            console.log('❌ Erro ao gerar filename:', error);
            cb(error as Error, '');
          }
        },
      }),
      fileFilter: (
        _req: any,
        file: any,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only image files (JPG, JPEG, PNG, GIF, WebP) are allowed!',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  )
  uploadEventImage(@UploadedFile() file: any): SuccessResponse<any> {
    console.log('🔍 Upload Debug (evento) - Arquivo recebido:', file);

    if (!file) {
      console.log('❌ Nenhum arquivo enviado (evento)');
      throw new BadRequestException('No file uploaded');
    }

    // Verificar se o arquivo foi realmente salvo
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const filename = file.filename as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const fileSize = file.size as number;
    const filePath = path.join('./uploads/events', filename || '');
    const absolutePath = path.resolve(filePath);
    const fileExists = fs.existsSync(absolutePath);

    console.log('📁 Caminho do arquivo (evento):', absolutePath);
    console.log('✅ Arquivo existe fisicamente:', fileExists);

    if (fileExists) {
      const stats = fs.statSync(absolutePath);
      console.log('📊 Tamanho do arquivo salvo (evento):', stats.size, 'bytes');
    }

    if (!fileExists) {
      console.log('❌ ERRO: Arquivo não foi salvo fisicamente! (evento)');
      throw new BadRequestException('File was not saved successfully');
    }

    const imageData = {
      filename: filename || '',
      url: `/uploads/events/${filename || ''}`,
      size: fileSize || 0,
    };

    console.log('📤 Resposta enviada (evento):', imageData);

    return new SuccessResponse(
      HttpStatus.CREATED,
      imageData,
      'Event image uploaded successfully',
    );
  }

  @Post('product-image')
  @ApiOperation({ summary: 'Upload product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, GIF, WebP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Image uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            filename: { type: 'string', example: 'product-uuid-123.jpg' },
            url: {
              type: 'string',
              example: '/uploads/products/product-uuid-123.jpg',
            },
            size: { type: 'number', example: 1024768 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid file type or no file uploaded',
  })
  @UseInterceptors(
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (
          req: any,
          file: any,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          const uploadPath = './uploads/products';
          console.log('📁 Definindo destino (produto):', uploadPath);
          console.log('📂 Pasta existe:', fs.existsSync(uploadPath));

          // Garantir que a pasta existe
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('✅ Pasta criada:', uploadPath);
          }

          cb(null, uploadPath);
        },
        filename: (
          _req: any,
          file: any,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          try {
            const uniqueId = uuidv4();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const ext = path.extname(file.originalname);
            const filename = `product-${uniqueId}${ext}`;

            console.log('📝 Criando arquivo (produto):', filename);
            console.log('🗂️ Extensão detectada:', ext);
            console.log('📄 Nome original:', file.originalname);

            cb(null, filename);
          } catch (error) {
            console.log('❌ Erro ao gerar filename:', error);
            cb(error as Error, '');
          }
        },
      }),
      fileFilter: (
        _req: any,
        file: any,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const allowedTypes = /\/(jpg|jpeg|png|gif)$/;
        if (!file.mimetype?.match(allowedTypes)) {
          cb(
            new BadRequestException(
              'Only image files (JPG, JPEG, PNG, GIF) are allowed!',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  )
  uploadProductImage(@UploadedFile() file: UploadedFileData | undefined) {
    console.log('🔍 Upload Debug (produto) - Arquivo recebido:', file);

    if (!file) {
      console.log('❌ Nenhum arquivo enviado (produto)');
      throw new BadRequestException('No file uploaded');
    }

    // Verificar se o arquivo foi realmente salvo
    const filename = file.filename || '';
    const fileSize = file.size || 0;
    const filePath = path.join('./uploads/products', filename);
    const absolutePath = path.resolve(filePath);
    const fileExists = fs.existsSync(absolutePath);

    console.log('📁 Caminho do arquivo (produto):', absolutePath);
    console.log('✅ Arquivo existe fisicamente:', fileExists);

    if (fileExists) {
      const stats = fs.statSync(absolutePath);
      console.log(
        '📊 Tamanho do arquivo salvo (produto):',
        stats.size,
        'bytes',
      );
    }

    if (!fileExists) {
      console.log('❌ ERRO: Arquivo não foi salvo fisicamente! (produto)');
      throw new BadRequestException('File was not saved successfully');
    }

    const imageData = {
      filename: filename,
      url: `/uploads/products/${filename}`,
      size: fileSize,
    };

    console.log('📤 Resposta enviada (produto):', imageData);

    return new SuccessResponse(
      HttpStatus.CREATED,
      imageData,
      'Product image uploaded successfully',
    );
  }
}
