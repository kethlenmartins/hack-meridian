import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.filesService.uploadFile(file);
  }

  @Get(':path')
  async getFileUrl(@Param('path') path: string) {
    return this.filesService.getFileUrl(path);
  }

  @Delete(':path')
  async deleteFile(@Param('path') path: string) {
    return this.filesService.deleteFile(path);
  }
}
